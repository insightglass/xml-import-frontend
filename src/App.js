import React, { useState } from 'react';

export default function XmlImportForm() {
  const [file, setFile] = useState(null);
  const [vendor, setVendor] = useState('Amsco');
  const [markup, setMarkup] = useState(1.35);
  const [jobNumber, setJobNumber] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobNumber) return alert("All fields are required.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("vendor", vendor);
    formData.append("markup", markup);
    formData.append("job_number", jobNumber);

    try {
      const res = await fetch("https://xml-import-backend.onrender.com/upload-xml/", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      alert("Failed to upload XML.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Upload Window Quote XML</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept=".xml" onChange={(e) => setFile(e.target.files[0])} />

        <select value={vendor} onChange={(e) => setVendor(e.target.value)} className="block w-full">
          <option value="Amsco">Amsco</option>
          <option value="Andersen">Andersen</option>
          <option value="Milgard">Milgard</option>
        </select>

        <input
          type="number"
          step="0.01"
          value={markup}
          onChange={(e) => setMarkup(parseFloat(e.target.value))}
          placeholder="Markup multiplier (e.g. 1.35)"
          className="block w-full"
        />

        <input
          type="text"
          value={jobNumber}
          onChange={(e) => setJobNumber(e.target.value)}
          placeholder="Job Number (e.g. LENLILLOT42)"
          className="block w-full"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {response && (
        <div className="mt-4 p-2 border">
          <p><strong>Status:</strong> {response.status}</p>
          <pre>{JSON.stringify(response.details, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
