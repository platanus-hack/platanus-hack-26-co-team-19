import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	INSTANCIA_LABELS,
	type LawyerCase,
	MATERIA_LABELS,
	OUTCOME_LABELS,
} from "../schemas/lawyer-profile.schema";

type CaseHistoryProps = {
	cases: LawyerCase[];
};

export const CaseHistory = ({ cases }: CaseHistoryProps) => {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-lg font-semibold tracking-tight">
				Expedientes observados
			</h2>
			<div className="overflow-x-auto rounded-xl border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Expediente</TableHead>
							<TableHead>Órgano</TableHead>
							<TableHead>Materia</TableHead>
							<TableHead>Instancia</TableHead>
							<TableHead>Año</TableHead>
							<TableHead>Resultado</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{cases.map((item) => (
							<TableRow key={`${item.expediente}-${item.instancia}`}>
								<TableCell className="font-mono text-xs">
									{item.expediente}
								</TableCell>
								<TableCell className="max-w-xs text-sm">
									{item.organo}
									<span className="mt-1 block text-xs text-muted-foreground">
										{item.distritoJudicial}
									</span>
								</TableCell>
								<TableCell>{MATERIA_LABELS[item.materia]}</TableCell>
								<TableCell>{INSTANCIA_LABELS[item.instancia]}</TableCell>
								<TableCell className="tabular-nums">{item.anio}</TableCell>
								<TableCell>{OUTCOME_LABELS[item.resultado]}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</section>
	);
};
