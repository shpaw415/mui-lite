# mui-lite

compatible @bunpmjs/bunext

To install:

```bash
bun i mui-lite
or
npm i mui-lite
```


```javascript XML
import "@bunpmjs/mui-lite/style.css";
import { ThemeProvider, DefaultTheme } from "@bunpmjs/mui-lite/theme";
import Button from "@bunpmjs/mui-lite/Button";

export default function App() {
    return (
        <ThemeProvider theme={DefaultTheme}>
            <Button>Material UI Button</Button>
        </ThemeProvider>
    );
}
```

Documentation will follow. 
In general almost all component follow the same props and behaviors of mui/material components but some have different props for some purpose 