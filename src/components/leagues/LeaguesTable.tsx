import { Theme, css, styled } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface IProps {
  hideFooter?: boolean;
  className?: string;
  columns: GridColDef[];
  rows: any[];
}

const DataTable: React.FC<IProps> = ({ className, columns, rows }) => {
  return (
    <div
      className={className}
      style={{ maxHeight: '370px', minHeight: '370px', width: '100%' }}
    >
      <DataGrid
        className={'custom-table'}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        checkboxSelection
        disableColumnFilter
        disableEval
        disableColumnMenu
        disableColumnSelector={true}
        disableRowSelectionOnClick
        disableDensitySelector
      />
    </div>
  );
};

export default styled(DataTable)(
  (props: IProps & { theme?: Theme }) => css`
    .custom-table {
      border: none;
    }
    .MuiDataGrid-footerContainer {
      ${props.hideFooter && 'display: none !important;'}
      ${props.hideFooter && 'border: none !important;'}
    }
    .MuiDataGrid-row:last-child div {
      border-bottom: none;
    }
  `
);
