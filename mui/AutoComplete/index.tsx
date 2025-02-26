import { useCallback, useEffect, useMemo, useState } from "react";
import { useMuiRef, type SlotProps } from "../../common/utils";
import type { TextFieldProps } from "../TextField";
import TextField from "../TextField";
import { useClassNames } from "@/common/theme";
import { List, ListItemButton, type ListProps } from "../List";
import { type FromArray } from "../../common/utils";
import Menu, { type MenuProps } from "../Menu";

export type ObjectTypeOptions = {
  label: string;
  [key: string]: any;
};
export type AutoCompleteProps = {
  SlotProps?: SlotProps<{
    input?: TextFieldProps;
    dropdown?: MenuProps;
    list?: ListProps;
  }>;
  options: Array<ObjectTypeOptions> | Array<string>;
  onSelect?: (value: FromArray<AutoCompleteProps["options"]>) => void;
  onChange?: React.FormEventHandler<HTMLInputElement>;
  value?: string;
};

export default function AutoComplete({
  SlotProps,
  options,
  onSelect,
  onChange,
  value,
}: AutoCompleteProps) {
  const [open, setOpen] = useState(true);
  useEffect(() => setOpen(false), []);
  const [showedOptions, setShowOptions] =
    useState<AutoCompleteProps["options"]>(options);

  const dropdown = useClassNames({
    component_name: "AutoComplete_dropdown_root",
    state: [open && "open"],
    className: SlotProps?.dropdown?.className,
  });

  const filter = useCallback(
    (options: AutoCompleteProps["options"], value: string) => {
      if (
        options.find((c) => {
          if (typeof c == "string" && value == c) return true;
          else if ((c as ObjectTypeOptions).label == value) return true;
        })
      )
        return options;
      console.log("filter");

      return options.filter((opt) => {
        if (!value) return true;
        const _value = value.toLowerCase();
        if (typeof opt == "string" && opt.includes(_value)) return true;
        else if (
          typeof opt != "string" &&
          (opt as { label: string }).label.toLowerCase().includes(_value)
        )
          return true;
        return false;
      }) as AutoCompleteProps["options"];
    },
    []
  );

  const changeHandler: React.FormEventHandler<HTMLInputElement> = (e) => {
    SlotProps?.input?.onChange?.(e);
    onChange?.(e);
    setShowOptions(filter(options, e.currentTarget.value));
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
    (option: FromArray<AutoCompleteProps["options"]>) => void
  >(
    (opt) => {
      onSelect?.(opt);
      setOpen(false);
      if (typeof opt == "string") inputRef.current?.setAttribute("value", opt);
      else inputRef.current?.setAttribute("value", opt.label);
    },
    [onSelect]
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
  >((pseudo, opt) => {
    const pseudoSelected = document.querySelector(
      `button[index-data="${pseudo}"]`
    );
    pseudoSelected?.scrollIntoView({
      inline: "center",
      block: "center",
      behavior: "smooth",
      ...opt,
    });
    return pseudo;
  }, []);

  useEffect(() => {
    if (!open) {
      set_pseudo_selection(undefined);
      return;
    }
    const ctrl = new AbortController();
    setShowOptions((c) => {
      const index = c.findIndex((d) => {
        if (typeof d == "string") return inputRef.current?.value == d;
        else return inputRef.current?.value == d.label;
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
        }
      },
      { signal: ctrl.signal }
    );

    return () => ctrl.abort();
  }, [open]);

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
      />
      <Menu
        open={open}
        {...SlotProps?.dropdown}
        anchorEl={inputRef}
        className={dropdown.combined}
        onClose={() => setOpen(false)}
        sx={{
          width: inputWidth,
          maxWidth: inputWidth,
        }}
        transform={{
          bottom: "translateY(10%)",
        }}
      >
        <List {...SlotProps?.list}>
          {showedOptions.map((opt, i) => {
            const value = inputRef.current?.value;
            if (typeof opt == "string")
              return (
                <ListItemButton
                  selected={value == opt}
                  className={[
                    pseudo_selection == i ? "pseudo_selected" : undefined,
                  ].join(" ")}
                  key={opt}
                  index-data={i}
                  onClick={() => onSelectHandler(opt)}
                  onMouseEnter={mouseEnterHandler}
                >
                  {opt}
                </ListItemButton>
              );
            else
              return (
                <ListItemButton
                  key={opt.label}
                  selected={opt.label == value}
                  className={[
                    pseudo_selection == i ? "pseudo_selected" : undefined,
                  ].join(" ")}
                  index-data={i}
                  onClick={() => onSelectHandler(opt)}
                  onMouseEnter={mouseEnterHandler}
                >
                  {opt.label}
                </ListItemButton>
              );
          })}
        </List>
      </Menu>
    </>
  );
}
