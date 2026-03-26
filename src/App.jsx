import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import JsonFormatter from './components/tools/JsonFormatter'
import ColorPicker from './components/tools/ColorPicker'
import RegexTester from './components/tools/RegexTester'
import WordCounter from './components/tools/WordCounter'
import Base64Tool from './components/tools/Base64Tool'
import MarkdownPreviewer from './components/tools/MarkdownPreviewer'
import PasswordGenerator from './components/tools/PasswordGenerator'
import HashGenerator from './components/tools/HashGenerator'
import JsonCsvConverter from './components/tools/JsonCsvConverter'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/json" replace />} />
        <Route path="json"     element={<JsonFormatter />} />
        <Route path="color"    element={<ColorPicker />} />
        <Route path="regex"    element={<RegexTester />} />
        <Route path="counter"  element={<WordCounter />} />
        <Route path="base64"   element={<Base64Tool />} />
        <Route path="markdown" element={<MarkdownPreviewer />} />
        <Route path="password" element={<PasswordGenerator />} />
        <Route path="hash"     element={<HashGenerator />} />
        <Route path="jscsv"    element={<JsonCsvConverter />} />
      </Route>
    </Routes>
  )
}