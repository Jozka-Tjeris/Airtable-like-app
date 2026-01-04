import { rows, type Row } from "./mockTableData"
import { TableRow } from "./TableRow"

export function TableBody(){
    return <div>
        {rows.map(row => (
            <TableRow key={row.id} row={row} />
        ))}
    </div>
}