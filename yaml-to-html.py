#!/usr/bin/python
"""
Usage:
    
    python yaml-to-html.py < /path/to/api.yaml > doc.html

"""
import yaml, json, sys

TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Beacon OpenAPI</title>
  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.2.2/swagger-ui.css" >
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.2.2/swagger-ui-bundle.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.2.2/swagger-ui-standalone-preset.js"></script>
<script>
(function() {

  var spec = %s;

  // Build a system
  const ui = SwaggerUIBundle({
    spec: spec,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  })

  window.ui = ui
})();
</script>
</body>
</html>
"""

print(TEMPLATE % json.dumps(yaml.load(sys.stdin)))
