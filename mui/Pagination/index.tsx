import { useClassNames, useStyle } from "@/common/theme";
import type { MuiElementType } from "@/common/utils";
import {
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";

import ArrowBackIcon from "@svg/filled/navigate_before.svg";
import ArrowNextIcon from "@svg/filled/navigate_next.svg";
import FirstPageIcon from "@svg/filled/first_page.svg";
import LastPageIcon from "@svg/filled/last_page.svg";
import ArrowDropDown from "@svg/filled/arrow_drop_down.svg";

import { RippleBase } from "@/common/ripple";
import type { BoxProps } from "../Box";
import Box from "../Box";
import { type SlotProps } from "../../common/utils";
import Typography, { type MuiTypographyProps } from "../Typography";
import { useLanguages } from "../locale";
import IconButton from "../IconButton";
import { useMemo } from "react";
import Menu from "../Menu";
import { List, ListItemButton, ListItemText } from "../List";

export type paginationItemParams = {
  page: number;
};

export type PaginationProps = Omit<
  MuiElementType<HTMLElement>,
  "size" | "onChange" | "getItemAriaLabel"
> & {
  count: number;
  color?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  boundaryCount?: number;
  hideNextButton?: boolean;
  hidePrevButton?: boolean;
  onChange?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    page: number
  ) => void;
  page?: number;
  renderItem?: (params: paginationItemParams) => ReactNode;
  shape?: "circular" | "rounded";
  showFirstButton?: boolean;
  firstButtonIcon?: ReactNode;
  showLastButton?: boolean;
  lastButtonIcon?: ReactNode;
  siblingCount?: number;
  variant?: "outlined" | "text";
  previousIcon?: ReactNode;
  nextIcon?: ReactNode;
  SlotProps?: SlotProps<{
    previous: PaginationItemProps;
    next: PaginationItemProps;
  }>;
  getItemAriaLabel?: (
    type: "first" | "last" | "next" | "previous" | "page",
    page: number,
    selected: boolean
  ) => string;
};

export default function Pagination({
  sx,
  variant = "text",
  color,
  disabled,
  className,
  count = 1,
  boundaryCount = 1,
  shape = "circular",
  siblingCount = 1,
  page = 1,
  size = "medium",
  hideNextButton,
  hidePrevButton,
  previousIcon,
  nextIcon,
  renderItem,
  onChange,
  showFirstButton,
  lastButtonIcon,
  showLastButton,
  firstButtonIcon,
  ...props
}: PaginationProps) {
  const style = useStyle(sx);
  const root = useClassNames({
    component_name: "pagination_root",
    className,
    state: [disabled && "disabled", size, variant, color, shape],
  });
  const language = useLanguages().components?.MuiPagination?.defaultProps;
  let ellipsis = false;

  return (
    <nav
      aria-label={language?.["aria-label"] || "pagination navigation"}
      {...props}
      style={style.styleFromSx}
      className={root.combined}
    >
      <ul className="MUI_pagination_ul">
        {showFirstButton && (
          <li>
            <PaginationItem
              onClick={(e) => page - 1 >= 0 && onChange?.(e, 1)}
              disabled={!Boolean(page - 1 > 0)}
            >
              {firstButtonIcon || <FirstPageIcon />}
            </PaginationItem>
          </li>
        )}
        {!hidePrevButton && (
          <li>
            <PaginationItem
              onClick={(e) => page - 1 >= 0 && onChange?.(e, page - 1)}
              disabled={!Boolean(page - 1 > 0)}
            >
              {previousIcon || <ArrowBackIcon />}
            </PaginationItem>
          </li>
        )}
        {Array(count)
          .fill(null)
          .map((_, index) => {
            index += 1;
            const ret = () =>
              renderItem ? (
                renderItem({
                  page: index,
                })
              ) : (
                <PaginationItemCount
                  key={index}
                  page={page}
                  index={index}
                  onChange={onChange}
                />
              );

            if (
              index <= boundaryCount ||
              index >= count - boundaryCount + 1 ||
              index == page ||
              (index >= page - siblingCount && index < page) ||
              (index <= page + siblingCount && index > page) ||
              (count > 4 && page <= 4 && index <= 4) ||
              (count > 8 && page >= count - 4 && index >= count - 4)
            ) {
              ellipsis = false;
              return ret();
            }

            if (ellipsis) return;
            else {
              ellipsis = true;
              return <PaginationEllipsis key={index} />;
            }
          })}
        {!hideNextButton && (
          <li>
            <PaginationItem
              onClick={(e) => page + 1 <= count && onChange?.(e, page + 1)}
              disabled={!Boolean(page + 1 <= count)}
            >
              {nextIcon || <ArrowNextIcon />}
            </PaginationItem>
          </li>
        )}
        {showLastButton && (
          <li>
            <PaginationItem
              onClick={(e) => page + 1 <= count && onChange?.(e, count)}
              disabled={!Boolean(page + 1 <= count)}
            >
              {lastButtonIcon || <LastPageIcon />}
            </PaginationItem>
          </li>
        )}
      </ul>
    </nav>
  );
}

function PaginationEllipsis() {
  return (
    <li>
      <div className="MUI_pagination_ellipsis_root">...</div>
    </li>
  );
}

function PaginationItemCount({
  index,
  onChange,
  page,
}: {
  index: number;
  onChange?: PaginationProps["onChange"];
  page: number;
}) {
  return (
    <ul>
      <PaginationItem
        onClick={(e) => onChange?.(e, index)}
        selected={page == index}
      >
        {index}
      </PaginationItem>
    </ul>
  );
}

export type PaginationItemProps = BoxProps & {
  selected?: boolean;
};

function PaginationItem({
  children,
  selected,
  className,
  disabled,
  ...props
}: PaginationItemProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const root = useClassNames({
    component_name: "pagination_item_root",
    state: [selected && "selected", disabled && "disabled"],
    className,
  });
  return (
    <Box
      Element="button"
      tabIndex={0}
      type="button"
      aria-current="page"
      {...props}
      className={root.combined}
      ref={ref as any}
    >
      {children}
      <RippleBase
        preventClickElement
        ref={ref}
        offset={{ top: -35, left: -35 }}
      />
    </Box>
  );
}

export type TablePaginationProps = {
  count: number;
  onPageChange?: (event: React.MouseEvent | null, page: number) => void;
  onRowsPerPageChange?: (rowPerPage: 10 | 25 | 50 | 100) => void;
  page?: number;
  /** set to -1 for all row */
  rowsPerPage?: 10 | 25 | 50 | 100;
  component?: ElementType;
  SlotProps?: SlotProps<{
    toolbar?: BoxProps;
    label?: BoxProps;
    spacer?: BoxProps;
    action?: BoxProps;
    displayRows?: MuiTypographyProps<HTMLParagraphElement>;
  }>;
  labelDisplayedRows?: ({
    from,
    to,
    count,
  }: {
    from: number;
    to: number;
    count: number;
  }) => string;
  getItemAriaLabel?: (type: "first" | "last" | "next" | "previous") => string;
  labelRowsPerPage?: string;
} & BoxProps;

export function TablePagination({
  component = "div",
  page = 0,
  count,
  onPageChange,
  rowsPerPage = 10,
  SlotProps,
  onRowsPerPageChange,
  labelDisplayedRows,
  getItemAriaLabel,
  labelRowsPerPage,
  ...props
}: TablePaginationProps) {
  const language = useLanguages().components?.MuiTablePagination?.defaultProps;

  const calculateTo = useCallback(
    (rowsPerPage: number, page: number, count: number) => {
      const res = rowsPerPage * page + rowsPerPage;
      if (res > count) return count;
      return res;
    },
    []
  );

  const from = useMemo(() => rowsPerPage * page + 1, [rowsPerPage, page]);
  const to = useMemo(
    () => calculateTo(rowsPerPage, page, count),
    [rowsPerPage, page, count]
  );

  return (
    <Box
      {...props}
      className={[props.className, "MUI_table_pagination_root"].join(" ")}
    >
      <Box
        {...SlotProps?.toolbar}
        className={[
          SlotProps?.label?.className,
          "MUI_table_pagination_toolbar",
        ].join(" ")}
      >
        <Box
          {...SlotProps?.spacer}
          className={[
            "MUI_table_pagination_spacer",
            SlotProps?.spacer?.className,
          ].join(" ")}
        />
        <Box
          children={
            <Typography>
              {labelRowsPerPage ||
                language?.labelRowsPerPage ||
                "Rows per page:"}
            </Typography>
          }
          {...SlotProps?.label}
          className={[
            SlotProps?.label?.className,
            "MUI_table_pagination_label",
          ].join(" ")}
        />
        <RowPerPageSelect
          rowsPerPage={rowsPerPage || 10}
          onChange={onRowsPerPageChange}
        />
        <Typography
          {...SlotProps?.displayRows}
          className={[
            SlotProps?.displayRows?.className,
            "MUI_table_pagination_display_row",
          ].join(" ")}
        >
          {labelDisplayedRows?.({
            from,
            to,
            count,
          }) ||
            language?.labelDisplayedRows?.({
              from,
              to,
              count,
            }) ||
            `${from}-${to} of ${count}`}
        </Typography>
        <Box
          {...SlotProps?.action}
          className={[
            SlotProps?.action?.className,
            "MUI_table_pagination_action_root",
          ].join(" ")}
        >
          <IconButton
            onClick={(e) => onPageChange?.(e, page - 1)}
            disabled={!(page > 0)}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            onClick={(e) => onPageChange?.(e, page + 1)}
            disabled={!(page + 1 < count / rowsPerPage)}
          >
            <ArrowNextIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

function RowPerPageSelect({
  rowsPerPage,
  onChange,
}: {
  rowsPerPage: 10 | 25 | 50 | 100;
  onChange?: (value: 10 | 25 | 50 | 100) => void;
}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const setChange = useCallback((value: 10 | 25 | 50 | 100) => {
    onChange?.(value);
    setOpen(false);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [rowsPerPage]);
  return (
    <Box
      className="MUI_table_pagination_input_wrapper"
      onClick={() => setOpen((c) => !c)}
    >
      <Typography className="MUI_table_pagination_input_value">
        {rowsPerPage}
      </Typography>
      <input
        value={rowsPerPage}
        onChange={(e) => setChange?.(parseInt(e.currentTarget.value) as 10)}
        aria-hidden
        aria-invalid={false}
        tabIndex={-1}
        className="MUI_table_pagination_input"
        ref={inputRef}
      />
      <ArrowDropDown
        className={[
          "MUI_table_pagination_input_drop_down_arrow",
          open && "_open",
        ].join(" ")}
      />
      <Menu
        anchorEl={inputRef}
        open={open}
        onClose={() => setOpen(false)}
        onClick={(e) => e.stopPropagation()}
        sx={{ transform: "translateX(0px)" }}
      >
        <List disablePadding>
          <ListItemButton
            selected={rowsPerPage == 10}
            onClick={() => setChange?.(10)}
          >
            <ListItemText primary="10" />
          </ListItemButton>
          <ListItemButton
            selected={rowsPerPage == 25}
            onClick={() => setChange?.(25)}
          >
            <ListItemText primary="25" />
          </ListItemButton>
          <ListItemButton
            selected={rowsPerPage == 50}
            onClick={() => setChange?.(50)}
          >
            <ListItemText primary="50" />
          </ListItemButton>
          <ListItemButton
            selected={rowsPerPage == 100}
            onClick={() => setChange?.(100)}
          >
            <ListItemText primary="100" />
          </ListItemButton>
        </List>
      </Menu>
    </Box>
  );
}
