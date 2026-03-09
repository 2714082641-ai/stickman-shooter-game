* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Arial', sans-serif;
  color: #333;
}

h1 {
  color: white;
  margin-bottom: 20px;
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

#gameCanvas {
  background: linear-gradient(to bottom, #87ceeb, #e0f6ff);
  border: 4px solid #333;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  cursor: crosshair;
  margin-bottom: 20px;
}

#scoreboard {
  background: white;
  padding: 20px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

#scoreboard p {
  font-size: 1.5em;
  font-weight: bold;
  margin: 10px 0;
  color: #333;
}

#scoreboard span {
  color: #667eea;
  font-size: 1.3em;
}

#instructions {
  font-size: 1em !important;
  color: #666 !important;
  font-weight: normal !important;
}
