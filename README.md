# mui-lite

To install:

```bash
bun i mui-lite
```


```javascript XML
import "@bunpmjs/mui-lite/style.css";
import { ThemeProvider, DefaultTheme } from "@bunpmjs/mui-lite/common/theme";
import Button from "@bunpmjs/mui-lite/Button";

export default function App() {
    return (
        <ThemeProvider theme={DefaultTheme}>
            <Button>Material UI Button</Button>
        </ThemeProvider>
    );
}
```