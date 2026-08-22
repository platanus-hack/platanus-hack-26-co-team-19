import BibliotecaLanding from "./BibliotecaLanding";
import ConfidencialLanding from "./ConfidencialLanding";
import DespachoLanding from "./DespachoLanding";
import EstudioAndinoLanding from "./EstudioAndinoLanding";
import FirmaBoutiqueLanding from "./FirmaBoutiqueLanding";
import GacetaLanding from "./GacetaLanding";
import GaleriaPasilloLanding from "./GaleriaPasilloLanding";
import MaderaSilencioLanding from "./MaderaSilencioLanding";
import SalaAudienciasLanding from "./SalaAudienciasLanding";
import SalaEsperaLanding from "./SalaEsperaLanding";

export const variantLandings = {
	"sala-espera": SalaEsperaLanding,
	despacho: DespachoLanding,
	biblioteca: BibliotecaLanding,
	"sala-audiencias": SalaAudienciasLanding,
	"estudio-andino": EstudioAndinoLanding,
	confidencial: ConfidencialLanding,
	gaceta: GacetaLanding,
	"firma-boutique": FirmaBoutiqueLanding,
	"galeria-pasillo": GaleriaPasilloLanding,
	"madera-silencio": MaderaSilencioLanding,
} as const;

export type VariantSlug = keyof typeof variantLandings;
