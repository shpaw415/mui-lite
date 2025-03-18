import { useCallback, useEffect, useMemo, useState, type JSX } from "react";
import { useMuiRef, type SlotProps, useRandomID } from "../../common/utils";
import type { TextFieldProps } from "../TextField";
import TextField from "../TextField";
import { useClassNames } from "../../common/theme";
import {
  List,
  ListItemButton,
  type ListItemButtonProps,
  type ListProps,
} from "../List";
import Menu, { type MenuProps } from "../Menu";

export type ObjectTypeOptions<T> = {
  label: T;
  [key: string]: any;
};

type OptionsTypes<T> =
  | ReadonlyArray<{ label: T; [key: string]: any }>
  | ReadonlyArray<T>;

type ValueType<Values> = Values extends { label: any }
  ? { label: Values; [key: string]: any }
  : Values;

export type AutoCompleteProps<Values extends OptionsTypes<string>> = {
  SlotProps?: SlotProps<{
    input?: TextFieldProps;
    dropdown?: MenuProps;
    list?: ListProps;
    listButton?: ListItemButtonProps;
  }>;
  options: Values;
  onSelect?: (value: Values[number]) => void;
  onChange?: React.FormEventHandler<HTMLInputElement>;
  listItemRender?: (
    value: ValueType<Values>[number]
  ) => JSX.Element | JSX.Element[];
  onFilter?: (option: ValueType<Values>[number], inputValue: string) => boolean;
  formatSelect?: (
    option: ValueType<Values>[number],
    inputValue: string
  ) => boolean;
  formatInput?: (option: ValueType<Values>[number]) => string;
  value?: string;
};

export default function AutoComplete<Values extends OptionsTypes<string>>({
  SlotProps,
  options,
  onSelect,
  onChange,
  onFilter,
  listItemRender,
  formatSelect,
  formatInput,
  value,
}: AutoCompleteProps<Values>) {
  const [open, setOpen] = useState(true);
  useEffect(() => setOpen(false), []);
  const [showedOptions, setShowOptions] = useState<Partial<Values>>(options);

  const dropdown = useClassNames({
    component_name: "AutoComplete_dropdown_root",
    state: [open && "open"],
    className: SlotProps?.dropdown?.className,
  });

  const ButtonClassId = useRandomID();

  const changeHandler: React.FormEventHandler<HTMLInputElement> = (e) => {
    SlotProps?.input?.onChange?.(e);
    onChange?.(e);
    if (onFilter) {
      const filtered = options.filter((opt) =>
        onFilter(opt, e.currentTarget.value)
      ) as unknown as Partial<Values>;
      setShowOptions(filtered);
    } else setShowOptions(filter(options, e.currentTarget.value));
    set_pseudo_selection(undefined);
    setOpen(true);
  };

  const onFocusHandler = useCallback<React.FocusEventHandler<HTMLInputElement>>(
    (e) => {
      e.preventDefault();
      SlotProps?.input?.onFocus?.(e);
      setOpen(true);
    },
    [SlotProps?.input?.onFocus, showedOptions.length]
  );

  const inputRef = useMuiRef<HTMLInputElement>(SlotProps?.input?.ref);

  const onSelectHandler = useCallback<
    (option: Partial<Values>[number]) => void
  >(
    (opt) => {
      if (opt) {
        onSelect?.(opt);
        if (inputRef.current?.value != undefined) {
          inputRef.current.value =
            formatInput?.(opt) ||
            (typeof opt == "string" ? opt : opt?.label || "");
        }
      }
      setOpen(false);
    },
    [onSelect, inputRef]
  );

  useEffect(() => {
    setShowOptions(options);
  }, [options.length]);

  const inputWidth = useMemo(() => {
    if (!inputRef.current) return 0;
    return inputRef.current.offsetWidth;
  }, [inputRef.current]);

  const [pseudo_selection, set_pseudo_selection] = useState<number>();

  const scrollToPseudo = useCallback<
    (pseudo: number, opt?: ScrollIntoViewOptions) => number
  >(
    (pseudo, opt) => {
      console.log(
        `button[index-data="${pseudo}"].${
          SlotProps?.input?.id || ButtonClassId
        }`
      );
      const pseudoSelected = document.querySelector(
        `button[index-data="${pseudo}"].${
          SlotProps?.input?.id || ButtonClassId
        }`
      );
      pseudoSelected?.scrollIntoView({
        inline: "center",
        block: "center",
        behavior: "smooth",
        ...opt,
      });
      return pseudo;
    },
    [SlotProps?.input?.id, ButtonClassId]
  );

  useEffect(() => {
    if (!open) {
      set_pseudo_selection(undefined);
      return;
    }
    const ctrl = new AbortController();
    setShowOptions((c) => {
      const index = c.findIndex((d) => {
        if (typeof d == "string") return inputRef.current?.value == d;
        else return inputRef.current?.value == d?.label;
      });
      if (index != -1) scrollToPseudo(index);
      return c;
    });
    inputRef.current?.addEventListener(
      "keydown",
      (e) => {
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            set_pseudo_selection((c) => {
              if (c == undefined) return 0;
              else if (c > 0) {
                return scrollToPseudo(c - 1);
              } else {
                return scrollToPseudo(showedOptions.length - 1);
              }
            });
            break;
          case "ArrowDown":
            e.preventDefault();
            set_pseudo_selection((c) => {
              if (c == undefined) return 0;
              else if (c < showedOptions.length) {
                return scrollToPseudo(c + 1);
              } else {
                return scrollToPseudo(0);
              }
            });
            break;
          case "Enter":
            e.preventDefault();
            set_pseudo_selection((current) => {
              if (current != undefined)
                onSelectHandler(showedOptions[current] as any);
              setOpen(false);
              return current;
            });
            break;
        }
      },
      { signal: ctrl.signal }
    );

    return () => ctrl.abort();
  }, [open, showedOptions.length]);

  const mouseEnterHandler = useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >((e) => {
    set_pseudo_selection(
      parseInt(e.currentTarget.getAttribute("index-data") as string)
    );
  }, []);

  const blurHandler = useCallback(() => {
    set_pseudo_selection(undefined);
  }, []);

  return (
    <>
      <TextField
        {...SlotProps?.input}
        ref={inputRef}
        onChange={changeHandler}
        onFocus={onFocusHandler}
        onBlur={blurHandler}
        value={value}
        autoComplete="off"
      />
      <Menu
        open={open}
        preventAutoPlacement
        {...SlotProps?.dropdown}
        anchorEl={inputRef}
        className={dropdown.combined}
        onClose={() => {
          if (document.activeElement != inputRef.current) setOpen(false);
        }}
        sx={{
          width: inputWidth,
          maxWidth: inputWidth,
        }}
        placement="bottom"
      >
        <List {...SlotProps?.list}>
          {showedOptions.map((opt, i) => {
            return (
              <ListItemButton
                key={typeof opt == "string" ? opt : opt?.label}
                {...SlotProps?.listButton}
                selected={
                  formatSelect
                    ? formatSelect(
                        opt as Values[number],
                        inputRef.current?.value || ""
                      )
                    : inputRef.current?.value ==
                      (typeof opt == "string" ? opt : opt?.label)
                }
                className={[
                  pseudo_selection == i ? "pseudo_selected" : undefined,
                  SlotProps?.listButton?.className,
                ].join(" ")}
                index-data={i}
                onClick={() => onSelectHandler(opt)}
                onMouseEnter={
                  mouseEnterHandler as React.MouseEventHandler<HTMLButtonElement>
                }
              >
                {listItemRender
                  ? listItemRender(opt as any)
                  : typeof opt == "string"
                  ? opt
                  : opt?.label}
              </ListItemButton>
            );
          })}
        </List>
      </Menu>
    </>
  );
}

function filter<Values extends OptionsTypes<string>>(
  opts: Values,
  value: string
) {
  if (
    opts.find((c) => {
      if (typeof c == "string" && value == c) return true;
      else if (typeof c != "string" && c.label == value) return true;
    })
  )
    return opts;
  if (!value) return opts;

  return opts.filter((opt) => {
    const option_value = (
      typeof opt == "string" ? opt : opt.label
    ).toLowerCase();

    if (option_value.includes(value)) return true;
    return false;
  }) as unknown as Partial<Values>;
}
