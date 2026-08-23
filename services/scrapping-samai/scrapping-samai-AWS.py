import io
import os
import re
import sys
import tempfile
import time
import zipfile
import psycopg2
import psycopg2.extras
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from dotenv import load_dotenv
load_dotenv()

# CONFIG
PG = dict(
    host=os.getenv("PGHOST"),
    port=os.getenv("PGPORT"),
    dbname=os.getenv("PGDATABASE"),
    user=os.getenv("PGUSER"),
    password=os.getenv("PGPASSWORD"),
    options="-c search_path=corte,public"
)
BUCKET = os.getenv("S3_BUCKET")
PREFIX = os.getenv("S3_PREFIX")
REGION = os.getenv("AWS_REGION")
LOCAL = os.path.abspath("pdfs")

URL = "https://samai.consejodeestado.gov.co/TitulacionRelatoria/BuscadorProvidenciasTituladas.aspx"
P = "MainContent_ResultadoBusqueda1_TitulacionesRepeater_"
BTN_BUSCAR = "MainContent_BuscarProvidenciasLinkButton"
BTN_DESCARGA = "MainContent_ResultadoBusqueda1_DescargarDocumentosLinkButton"
BTN_SIG = "MainContent_ResultadoBusqueda1_PaginaSiguienteLinkButton"
LBL_PAG = "MainContent_ResultadoBusqueda1_PaginaActualLabel"
TMP = os.path.abspath("_descargas")
RE_ZIP = re.compile(r"(\d{18,25})_P(\d+)")

MESES = {"enero": 1, "febrero": 2, "marzo": 3, "abril": 4, "mayo": 5, "junio": 6,
         "julio": 7, "agosto": 8, "septiembre": 9, "octubre": 10, "noviembre": 11,
         "diciembre": 12}

TXT_IRA = "MainContent_ResultadoBusqueda1_IrAPaginaTextBox"
BTN_IRA = "MainContent_ResultadoBusqueda1_IrALinkButton"

FAVORABLE = ("ADMITE", "CONCEDE", "ACCEDE", "REVOCA", "DECRETA", "AMPARA",
             "ACEPTA", "RECONOCE", "REPONE", "DECLARA LA NULIDAD", "ORDENA")
DESFAVORABLE = ("RECHAZA", "NIEGA", "CONFIRMA", "INADMITE", "IMPROCEDENTE",
                "NO REPONE", "ABSTIENE", "DECLARA INFUNDAD", "DECLARA LA FALTA")


# HELPERS
def limpio(e):
    return re.sub(r"\s+", " ", e.get_text(" ", strip=True)) if e else ""


def t(s, n, i):
    return limpio(s.find(id=f"{P}{n}_{i}"))

def clasifica(tipo, actuacion):
    tp, a = (tipo or "").upper(), (actuacion or "").upper()
    if "SALVAMENTO" in tp:
        return "SALVAMENTO", "SALVAMENTO"
    if "ACLARACI" in tp:
        return "ACLARACION", "ACLARACION"
    doc = "AUTO" if "AUTO" in tp else "SENTENCIA"
    for k in DESFAVORABLE:
        if k in a:
            return doc, "DESFAVORABLE"
    for k in FAVORABLE:
        if k in a:
            return doc, "FAVORABLE"
    return doc, None


def fecha(txt):
    m = re.search(r"(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})", txt or "", re.I)
    if not m:
        return None
    mes = MESES.get(m.group(2).lower())
    return f"{m.group(3)}-{mes:02d}-{int(m.group(1)):02d}" if mes else None




def ir_a_pagina(d, n, timeout=60):

    lbl = d.find_element(By.ID, LBL_PAG)
    caja = d.find_element(By.ID, TXT_IRA)
    caja.clear()
    caja.send_keys(str(n))
    d.execute_script("arguments[0].click();", d.find_element(By.ID, BTN_IRA))
    WebDriverWait(d, timeout).until(EC.staleness_of(lbl))
    time.sleep(1)
    actual = limpio(BeautifulSoup(d.page_source, "html.parser").find(id=LBL_PAG))
    print(f"salto a pagina {n} (label dice: {actual})")
    return True


def parte_sala(sala):
    m = re.search(r"Secci[óo]n\s+(\w+)", sala or "", re.I)
    sec = f"SECCION {m.group(1).upper()}" if m else None
    m = re.search(r"Subsecci[óo]n\s+([A-C])", sala or "", re.I)
    return sec, (m.group(1) if m else None)


def solo_num(s):
    return re.sub(r"[^0-9]", "", s or "")


def hacer_id(radicado, orden, certificado):
    cert = (certificado or "")[:16]
    return f"{solo_num(radicado)}_P{orden}{'_' + cert if cert else ''}.pdf"


# EXTRAER
def extraer(html, pagina):
    s = BeautifulSoup(html, "html.parser")
    provs, probs, descs, firms, votos = [], [], [], [], []

    for i in range(20):
        if not s.find(id=f"{P}HypRadicado_{i}"):
            continue

        rad = t(s, "HypRadicado", i)
        cert = t(s, "Lblhash", i).replace("Certificado:", "").strip()
        orden = i + 1
        _id = hacer_id(rad, orden, cert)

        sala = t(s, "LbNombreSalaDecision", i)
        sec, sub = parte_sala(sala)
        tipo = t(s, "LblTIPOPROVIDENCIA", i)
        act = t(s, "LblA110DESCACTU", i)
        tipo_doc, sentido = clasifica(tipo, act)
        pon = t(s, "LblPonente", i).upper()
        clase = t(s, "LblClaseProceso", i)

        fpr = fecha(t(s, "Label1", i))
        dig = solo_num(rad)
        anio_rad = (int(dig[12:16]) if len(dig) >= 16
                    and dig[12:16].startswith(("19", "20")) else None)
        anio_fal = int(fpr[:4]) if fpr else None

        provs.append(dict(
            id=_id, certificado=cert or None, radicado=rad,
            interno=t(s, "LblInterno", i), pagina=pagina, orden=orden,
            tipo_doc=tipo_doc, clase_proceso=clase,
            es_tutela=bool(re.search("tutela", clase, re.I)),
            ponente=pon, sala=sala, seccion=sec, subseccion=sub,
            actor=t(s, "LblActor", i), demandado=t(s, "LblDemandado", i),
            fecha_proceso=fecha(t(s, "LblFECHAPROC", i)),
            fecha_providencia=fpr,
            anio_radicado=anio_rad, anio_fallo=anio_fal,
            duracion_anios=(anio_fal - anio_rad) if (anio_fal and anio_rad) else None,
            tipo=tipo, actuacion=act, sentido=sentido,
            s3_key=None, status=None))

        if tipo_doc in ("SALVAMENTO", "ACLARACION") and pon:
            votos.append((_id, cert, rad, pon, tipo_doc))

        pref = f"{P}TitulacionProvidenciaTexto1_{i}_TitulacionRepeater_{i}_"
        for j in range(20):
            pj = s.find(id=f"{pref}ProblemaJuridicoLabel_{j}")
            if not pj:
                continue
            resp = limpio(s.find(id=f"{pref}SeResuelveProblemaJuridicoLabel_{j}"))
            just = ""
            cont = pj.find_parent("div")
            if cont and cont.find_next_sibling("div"):
                just = limpio(cont.find_next_sibling("div"))
            fuente = limpio(s.find(id=f"{pref}FuenteLabel_{j}")).replace(
                "FUENTE FORMAL:", "").strip()

            probs.append((_id, cert, rad,
                          limpio(pj).replace("Problema jurídico:", "").strip(),
                          resp.split(":")[-1].strip(), just, fuente, None))

            bloque = pj.find_parent(class_="samai-titulacion-item")
            if bloque:
                for a in bloque.find_all("a", href=re.compile("tesauro")):
                    descs.append((_id, cert, rad, limpio(a)))

        fdiv = s.find(id=re.compile(rf"FirmantesProvidencia1_{i}_"))
        if fdiv:
            tabla = fdiv.find_parent("div")
            for tr in (tabla.find_all("tr") if tabla else []):
                tds = tr.find_all("td")
                if len(tds) < 3:
                    continue
                mag = limpio(tds[0]).upper()
                if not mag:
                    continue
                manif = limpio(tds[2])
                firms.append((_id, cert, rad, mag, limpio(tds[1]), manif))
                mu = manif.upper()
                if "SALVAMENTO" in mu:
                    votos.append((_id, cert, rad, mag, "SALVAMENTO"))
                elif "ACLARACI" in mu:
                    votos.append((_id, cert, rad, mag, "ACLARACION"))

    provs = list({p_["id"]: p_ for p_ in provs}.values())
    return provs, probs, list(set(descs)), list(set(firms)), list(set(votos))


# STORAGE
class Storage:


    def __init__(self):
        self.s3 = None
        if BUCKET:
            try:
                import boto3
                self.s3 = boto3.client("s3", region_name=REGION)
                self.s3.head_bucket(Bucket=BUCKET)
                print(f"storage: s3://{BUCKET}/{PREFIX}")
            except Exception as e:
                self.s3 = None
        if not self.s3:
            os.makedirs(LOCAL, exist_ok=True)
            print(f"storage: {LOCAL}")

    def guardar(self, data, rad, nombre):
        key = f"{PREFIX}{nombre}"
        if self.s3:
            self.s3.upload_fileobj(io.BytesIO(data), BUCKET, key,
                                   ExtraArgs={"ContentType": "application/pdf"})
            return key
        os.makedirs(LOCAL, exist_ok=True)
        ruta = os.path.join(LOCAL, nombre)
        with open(ruta, "wb") as f:
            f.write(data)
        return os.path.relpath(ruta).replace("\\", "/")


def espera_zip(antes, timeout=180):
    fin = time.time() + timeout
    while time.time() < fin:
        ahora = set(os.listdir(TMP))
        if any(a.endswith(".crdownload") for a in ahora):
            time.sleep(1)
            continue
        nuevos = [a for a in ahora - antes if a.lower().endswith(".zip")]
        if nuevos:
            time.sleep(0.5)
            return os.path.join(TMP, nuevos[0])
        time.sleep(1)
    return None


def procesa_zip(ruta_zip, store, por_orden):
    guardados = {}
    por_rad = {solo_num(v["radicado"]): v for v in por_orden.values()}

    def guardar(data, rad, orden):
        rad = solo_num(rad)
        prov = por_rad.get(rad)
        nombre = prov["id"] if prov else hacer_id(rad, orden, "")
        try:
            guardados[rad] = store.guardar(data, rad, nombre)
        except Exception as e:
            print("      storage:", type(e).__name__, e)

    def recorre(z_path, nivel=0):
        if nivel > 5:
            return
        try:
            zf = zipfile.ZipFile(z_path)
        except zipfile.BadZipFile:
            print("zip corrupto")
            return
        with zf, tempfile.TemporaryDirectory() as tmp:
            zf.extractall(tmp)
            for raiz, _, archivos in os.walk(tmp):
                for a in archivos:
                    full = os.path.join(raiz, a)
                    m = RE_ZIP.match(a)
                    if a.lower().endswith(".zip"):
                        if m:                                  # nivel 2
                            rad, orden = m.group(1), int(m.group(2))
                            try:
                                with zipfile.ZipFile(full) as z2:
                                    for n in z2.namelist():
                                        if n.lower().endswith(".pdf"):
                                            guardar(z2.read(n), rad, orden)
                            except zipfile.BadZipFile:
                                print("zip interno corrupto")
                        else:
                            recorre(full, nivel + 1)
                    elif a.lower().endswith(".pdf") and m:
                        with open(full, "rb") as fh:
                            guardar(fh.read(), m.group(1), int(m.group(2)))

    recorre(ruta_zip)
    return guardados

#  SQL
SQL_PROV = """
INSERT INTO providencias (id, certificado, radicado, interno, pagina, orden,
  tipo_doc, clase_proceso, es_tutela, ponente, sala, seccion, subseccion,
  actor, demandado, fecha_proceso, fecha_providencia, anio_radicado, anio_fallo,
  duracion_anios, tipo, actuacion, sentido, s3_key, status)
VALUES (%(id)s,%(certificado)s,%(radicado)s,%(interno)s,%(pagina)s,%(orden)s,
  %(tipo_doc)s,%(clase_proceso)s,%(es_tutela)s,%(ponente)s,%(sala)s,%(seccion)s,
  %(subseccion)s,%(actor)s,%(demandado)s,%(fecha_proceso)s,%(fecha_providencia)s,
  %(anio_radicado)s,%(anio_fallo)s,%(duracion_anios)s,%(tipo)s,%(actuacion)s,
  %(sentido)s,%(s3_key)s,%(status)s)
ON CONFLICT (id) DO UPDATE SET
  s3_key = COALESCE(EXCLUDED.s3_key, providencias.s3_key),
  status = COALESCE(EXCLUDED.status, providencias.status);
"""

SQL_PROB = ("INSERT INTO problemas (id, certificado, radicado, problema, respuesta,"
            " justificacion, fuente_formal, status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)")
SQL_DESC = ("INSERT INTO descriptores (id, certificado, radicado, descriptor)"
            " VALUES (%s,%s,%s,%s)")
SQL_FIRM = ("INSERT INTO firmantes (id, certificado, radicado, magistrado, estado,"
            " manifestacion) VALUES (%s,%s,%s,%s,%s,%s)")
SQL_VOTO = ("INSERT INTO votos (id, certificado, radicado, magistrado, tipo)"
            " VALUES (%s,%s,%s,%s,%s)")


# RUN
def run(paginas=10, desde=1):
    os.makedirs(TMP, exist_ok=True)
    con = psycopg2.connect(**PG)
    store = Storage()

    op = Options()
    op.add_argument("--window-size=1500,1000")
    op.add_experimental_option("prefs", {
        "download.default_directory": TMP,
        "download.prompt_for_download": False,
        "download.directory_upgrade": True,
        "plugins.always_open_pdf_externally": True})
    d = webdriver.Chrome(options=op)
    tot = dict(prov=0, prob=0, pdf=0, voto=0)
    t0 = time.time()

    try:
        d.get(URL)
        btn = WebDriverWait(d, 60).until(
            EC.presence_of_element_located((By.ID, BTN_BUSCAR)))
        d.execute_script("arguments[0].click();", btn)
        WebDriverWait(d, 60).until(EC.presence_of_element_located((By.ID, LBL_PAG)))
        time.sleep(2)
        print(f"pg={PG['dbname']}\n")

        if desde > 1:
            ir_a_pagina(d, desde)

        for p in range(desde, desde + paginas):
            provs, probs, descs, firms, votos = extraer(d.page_source, p)
            if not provs:

                break
            por_orden = {x["orden"]: x for x in provs}

            antes = set(os.listdir(TMP))
            nota, guardados = "", {}
            try:
                d.execute_script("arguments[0].click();",
                                 d.find_element(By.ID, BTN_DESCARGA))
                z = espera_zip(antes)
                if z:
                    guardados = procesa_zip(z, store, por_orden)
                    try:
                        os.remove(z)
                    except Exception as e:
                        print("      no pude borrar zip:", e)
                else:
                    nota = " (zip TIMEOUT)"
            except Exception as e:
                nota = f" (zip {type(e).__name__})"

            print(f"      guardados={len(guardados)} - {list(guardados)[:5]}")

            for prov in provs:
                path = guardados.get(solo_num(prov["radicado"]))
                if path:
                    prov["s3_key"] = path

            with con, con.cursor() as cur:
                ids = [x["id"] for x in provs]
                for tabla in ("problemas", "descriptores", "firmantes", "votos"):
                    cur.execute(f"DELETE FROM {tabla} WHERE id = ANY(%s)", (ids,))
                psycopg2.extras.execute_batch(cur, SQL_PROV, provs)
                psycopg2.extras.execute_batch(cur, SQL_PROB, probs)
                psycopg2.extras.execute_batch(cur, SQL_DESC, descs)
                psycopg2.extras.execute_batch(cur, SQL_FIRM, firms)
                psycopg2.extras.execute_batch(cur, SQL_VOTO, votos)

            tot["prov"] += len(provs); tot["prob"] += len(probs)
            tot["pdf"] += len(guardados); tot["voto"] += len(votos)
            vel = tot["prov"] / max(time.time() - t0, 1) * 60
            print(f"pag {p:>5}: {len(provs)} prov | {len(probs)} probl | "
                  f"{len(votos)} votos | {len(guardados)} pdf{nota} | "
                  f"acum {tot['prov']}/{tot['prob']}/{tot['pdf']} | {vel:.0f}/min")

            if p == desde + paginas - 1:
                break
            try:
                lbl = d.find_element(By.ID, LBL_PAG)
                d.execute_script("arguments[0].click();",
                                 d.find_element(By.ID, BTN_SIG))
                WebDriverWait(d, 60).until(EC.staleness_of(lbl))
                time.sleep(1)
            except Exception as e:
                print("fin paginacion:", type(e).__name__)
                break
    finally:
        d.quit()
        con.close()
        print(f"\n{tot['prov']} providencias | {tot['prob']} problemas | "
              f"{tot['voto']} votos | {tot['pdf']} PDFs")

if __name__ == "__main__":
    paginas = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    desde = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    run(paginas, desde)
