import { Theme, css, styled } from '@mui/material';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import useScrollTo from 'hooks/ui/useScrollTo';
import { useEffect } from 'react';

interface IProps {
  hideFooter?: boolean;
  className?: string;
  columns: GridColDef[];
  rows: any[];
  onRowSelect?: (selected: any) => void;
  height?: string;
  loading?: boolean;
  pageSize?: number;
  automaticScrolling?: boolean;
}

const CustomDataTable: React.FC<IProps> = ({
  className,
  columns,
  rows,
  onRowSelect,
  height,
  loading,
  pageSize = 5,
  automaticScrolling,
}) => {
  const apiRef = useGridApiRef();
  const { scrollDataGridToBottom } = useScrollTo();

  useEffect(() => {
    if (!automaticScrolling) {
      return;
    }
    setTimeout(() => {
      scrollDataGridToBottom(10000, 500, apiRef, () => {});
    }, 2000);
  }, []);

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
        className="custom-table"
        rows={rows}
        apiRef={apiRef}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize },
          },
        }}
        pageSizeOptions={[pageSize]}
        onRowClick={(param1) => onRowSelect?.(param1.row)}
        disableColumnFilter
        disableEval
        disableColumnMenu
        disableColumnSelector
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
    .MuiDataGrid-cell:focus {
      outline: none;
    }
  `,
);
