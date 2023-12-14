import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { DefaultTheme } from "./styles/themes/default";
import { GlobalStyle } from "./styles/global";
import { Router } from './Router';
import { CyclesContextProvider } from './context/CyclesContext';

export function App() {
  return (
    <ThemeProvider theme={DefaultTheme}>
      <BrowserRouter>
        <CyclesContextProvider>
            <Router />
        </CyclesContextProvider>
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
  )
}
