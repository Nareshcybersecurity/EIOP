# Enterprise Infrastructure Operations Portal

EIOP is a static enterprise infrastructure dashboard built with HTML, CSS, and vanilla JavaScript.

## Run

For automatic workbook loading, serve the `eiop` directory with any static web server:

```powershell
python -m http.server 8080 --directory eiop
```

Then open `http://localhost:8080`.

You may also open `index.html` directly. If the browser blocks local workbook access, use the displayed **Select servers.xlsx** button and choose `data/servers.xlsx`.

## Data contract

The UI reads the first worksheet in `data/servers.xlsx`. The required column names match the supplied workbook. The data access layer is isolated in `js/excel.js` so it can be replaced by a REST API adapter in a future version.
