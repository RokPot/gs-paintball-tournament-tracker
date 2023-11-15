import { Theme, css, styled } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface IProps {
  hideFooter?: boolean;
  className?: string;
  columns: GridColDef[];
  rows: any[];
  onRowSelect?: (selected: any) => void;
  height?: string;
  loading?: boolean;
}

const CustomDataTable: React.FC<IProps> = ({
  className,
  columns,
  rows,
  onRowSelect,
  height,
  loading,
}) => {
  return (
    <div
      className={className}
      style={{
        maxHeight: height || '370px',
        minHeight: height || '370px',
        height: height || '370px',
        width: '100%',
      }}
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
        pageSizeOptions={[5]}
        onRowClick={(param1) => onRowSelect?.(param1.row)}
        disableColumnFilter
        disableEval
        disableColumnMenu
        disableColumnSelector={true}
        disableDensitySelector
        loading={loading}
      />
    </div>
  );
};

export default styled(CustomDataTable)(
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
