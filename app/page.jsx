"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Download, AlignJustify } from "lucide-react";

export default function PDFTablePage() {
  const [companyName, setCompanyName] = useState("نام شرکت");
  const [companySubtitle, setCompanySubtitle] = useState(
    "توضیحات و زیرعنوان شرکت",
  );
  const [website, setWebsite] = useState("www.company.com");
  const [whatsapp, setWhatsapp] = useState("+98 912 345 6789");
  const [email, setEmail] = useState("info@company.com");
  const [headerColor, setHeaderColor] = useState("#3b82f6");
  const [notes, setNotes] = useState([]);

  const initialColumns = [
    { id: 1, name: "ستون 1" },
    { id: 2, name: "ستون 2" },
    { id: 3, name: "ستون 3" },
    { id: 4, name: "ستون 4" },
    { id: 5, name: "ستون 5" },
    { id: 6, name: "ستون 6" },
    { id: 7, name: "ستون 7" },
  ];

  const [columns, setColumns] = useState(initialColumns);
  const [rows, setRows] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      isHeader: false,
      data: initialColumns.reduce(
        (acc, col) => ({ ...acc, [col.id]: "" }),
        {},
      ),
    })),
  );

  // بارگذاری از حافظه محلی
  useEffect(() => {
    const savedData = localStorage.getItem("tableData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCompanyName(parsed.companyName || "نام شرکت");
        setCompanySubtitle(
          parsed.companySubtitle || "توضیحات و زیرعنوان شرکت",
        );
        setWebsite(parsed.website || "www.company.com");
        setWhatsapp(parsed.whatsapp || "+98 912 345 6789");
        setEmail(parsed.email || "info@company.com");
        setHeaderColor(parsed.headerColor || "#3b82f6");
        setColumns(parsed.columns || initialColumns);
        setRows(parsed.rows || rows);
        setNotes(parsed.notes || []);
      } catch (e) {
        console.error("خطا در بارگذاری داده‌ها:", e);
      }
    }
  }, []);

  // ذخیره در حافظه محلی
  useEffect(() => {
    const dataToSave = {
      companyName,
      companySubtitle,
      website,
      whatsapp,
      email,
      headerColor,
      columns,
      rows,
      notes,
    };
    localStorage.setItem("tableData", JSON.stringify(dataToSave));
  }, [
    companyName,
    companySubtitle,
    website,
    whatsapp,
    email,
    headerColor,
    columns,
    rows,
    notes,
  ]);

  const addColumn = () => {
    const newId = Math.max(...columns.map((c) => c.id), 0) + 1;
    const newColumn = { id: newId, name: `ستون ${newId}` };
    setColumns([...columns, newColumn]);
    setRows(
      rows.map((row) => ({
        ...row,
        data: { ...row.data, [newId]: "" },
      })),
    );
  };

  const insertColumnAfter = (colId) => {
    const index = columns.findIndex((c) => c.id === colId);
    if (index === -1) return;
    const newId = Math.max(...columns.map((c) => c.id), 0) + 1;
    const newColumn = { id: newId, name: `ستون ${newId}` };
    const newColumns = [...columns];
    newColumns.splice(index + 1, 0, newColumn);
    setColumns(newColumns);
    setRows(
      rows.map((row) => ({
        ...row,
        data: { ...row.data, [newId]: "" },
      })),
    );
  };

  const deleteColumn = (colId) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter((col) => col.id !== colId));
    setRows(
      rows.map((row) => {
        const newData = { ...row.data };
        delete newData[colId];
        return { ...row, data: newData };
      }),
    );
  };

  const addRow = () => {
    const newId = Math.max(...rows.map((r) => r.id), 0) + 1;
    setRows([
      ...rows,
      {
        id: newId,
        isHeader: false,
        data: columns.reduce(
          (acc, col) => ({ ...acc, [col.id]: "" }),
          {},
        ),
      },
    ]);
  };

  const insertRowAfter = (rowId) => {
    const index = rows.findIndex((r) => r.id === rowId);
    if (index === -1) return;
    const newId = Math.max(...rows.map((r) => r.id), 0) + 1;
    const newRow = {
      id: newId,
      isHeader: false,
      data: columns.reduce(
        (acc, col) => ({ ...acc, [col.id]: "" }),
        {},
      ),
    };
    const newRows = [...rows];
    newRows.splice(index + 1, 0, newRow);
    setRows(newRows);
  };

  const deleteRow = (rowId) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((row) => row.id !== rowId));
  };

  const toggleRowHeader = (rowId) => {
    setRows(
      rows.map((row) =>
        row.id === rowId ? { ...row, isHeader: !row.isHeader } : row,
      ),
    );
  };

  const updateCell = (rowId, colId, value) => {
    setRows(
      rows.map((row) =>
        row.id === rowId
          ? { ...row, data: { ...row.data, [colId]: value } }
          : row,
      ),
    );
  };

  const updateColumnName = (colId, newName) => {
    setColumns(
      columns.map((col) =>
        col.id === colId ? { ...col, name: newName } : col,
      ),
    );
  };

  const addNote = () => {
    const newId =
      notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
    setNotes([...notes, { id: newId, text: "نکته جدید..." }]);
  };

  const updateNote = (id, text) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, text } : note,
      ),
    );
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const generatePDF = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    const content = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <style>
          @media print {
            @page { 
              margin: 1cm;
              size: A4;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
          * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body { 
            font-family: 'Tahoma', Arial, sans-serif; 
            padding: 20px;
            direction: rtl;
            background: #f1f5f9;
          }
          .header { 
          position:relative;
            text-align: center; 
            margin-bottom: 30px;
            padding: 30px 20px;
            background: #012710 !important;
            color: white !important;
            border-radius: 8px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
            .header img{
            position:absolute;
            top:20px;
            left:20px;
            width:80px;
            }
          .header h1 { 
            font-size: 32px; 
            font-weight: bold;
            margin-bottom: 10px;
            color: white !important;
          }
          .header p {
            font-size: 16px;
            color: white !important;
            opacity: 1;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 30px;
            background: white;
          }
          th, td { 
            border: 1px solid #333 !important; 
            padding: 10px 12px; 
            text-align: center;
            font-size: 15px;
            color: #1f2937 !important;
            background: white !important;
            height: auto;
            white-space: pre-wrap;
          }
          th { 
            background-color: ${headerColor} !important;
            color: white !important;
            font-weight: bold;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .row-header td {
            background-color: ${headerColor} !important;
            color: white !important;
            font-weight: bold;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .notes-section {
            margin-top: 30px;
            margin-bottom: 60px;
            padding: 0;
          }
          .notes-section .note-item {
            color: #1f2937;
            font-size: 15px;
            margin-bottom: 10px;
            display: flex;
            align-items: start;
            gap: 8px;
          }
          .notes-section .note-item .star {
            color: #1f2937;
            font-weight: bold;
            margin-top: 2px;
          }
          .footer { 
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center; 
            font-size: 13px; 
            color: white !important;
            padding: 15px 20px;
            background: #012710 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .footer-content {
            display: flex;
            justify-content: center;
            gap: 25px;
            flex-wrap: wrap;
            color: white !important;
          }
          .footer-content span {
            color: white !important;
          }
          .footer-content .phone {
            direction: ltr;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="header">
        <img src="/logo.png"/>
          <h1>${companyName}</h1>
          <p>${companySubtitle}</p>
        </div>
        <table>
          <thead>
            <tr>
              ${columns.map((col) => `<th>${col.name}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
              <tr${row.isHeader ? ' class="row-header"' : ""}>
                ${columns
                  .map(
                    (col) => `
                  <td>${String(row.data[col.id] || "")
                    .split("\n")
                    .join("<br/>")}</td>
                `,
                  )
                  .join("")}
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        ${
          notes.length > 0
            ? `
          <div class="notes-section">
            ${notes
              .map(
                (note) => `
              <div class="note-item">
                <span class="star">*</span>
                <span>${note.text}</span>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }
        <div class="footer">
          <div class="footer-content">
            <span>🌐 ${website}</span>
            <span>📱 <span class="phone">${whatsapp}</span></span>
            <span>📧 ${email}</span>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* هدر صفحه */}
        <div
          className="rounded-lg shadow-lg p-8 mb-6 text-center"
          style={{ background: "#012710" }}>
          <h1 className="text-4xl font-bold text-white mb-2">
            {companyName}
          </h1>
          <p className="text-lg text-gray-200">{companySubtitle}</p>
        </div>

        {/* تنظیمات */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-right text-gray-800">
            ⚙️ تنظیمات
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-right">
              <label className="block text-sm font-bold mb-2 text-gray-800">
                عنوان اصلی
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-right text-gray-900 font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="text-right">
              <label className="block text-sm font-bold mb-2 text-gray-800">
                زیرعنوان
              </label>
              <input
                type="text"
                value={companySubtitle}
                onChange={(e) => setCompanySubtitle(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-right text-gray-900 font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="text-right">
              <label className="block text-sm font-bold mb-2 text-gray-800">
                رنگ هدر جدول
              </label>
              <input
                type="color"
                value={headerColor}
                onChange={(e) => setHeaderColor(e.target.value)}
                className="w-full h-12 p-1 border-2 border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            <div className="text-right">
              <label className="block text-sm font-bold mb-2 text-gray-800">
                وبسایت
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-right text-gray-900 font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="text-right">
              <label className="block text-sm font-bold mb-2 text-gray-800">
                واتساپ
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-right text-gray-900 font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="text-right">
              <label className="block text-sm font-bold mb-2 text-gray-800">
                ایمیل
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-right text-gray-900 font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* دکمه‌های اکشن */}
        <div className="flex gap-3 mb-6 flex-wrap justify-end">
          <button
            onClick={addColumn}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition shadow-md font-bold">
            <Plus size={20} />
            افزودن ستون
          </button>
          <button
            onClick={addRow}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition shadow-md font-bold">
            <Plus size={20} />
            افزودن ردیف
          </button>
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700 transition shadow-md font-bold">
            <Download size={20} />
            دریافت PDF
          </button>
        </div>

        {/* جدول */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: headerColor }}>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className="border border-gray-300 p-3 text-white relative group">
                    <input
                      type="text"
                      value={col.name}
                      onChange={(e) =>
                        updateColumnName(col.id, e.target.value)
                      }
                      className="bg-transparent text-center w-full text-white font-bold outline-none"
                      style={{ color: "white" }}
                    />
                    <button
                      onClick={() => insertColumnAfter(col.id)}
                      className="absolute top-1 right-1 bg-green-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                      title="افزودن ستون بعد از این ستون">
                      <Plus size={14} />
                    </button>
                    {columns.length > 1 && (
                      <button
                        onClick={() => deleteColumn(col.id)}
                        className="absolute top-1 left-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </th>
                ))}
                <th className="border border-gray-300 p-3 bg-gray-200 w-24 text-gray-800 font-bold">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={row.isHeader ? "" : "hover:bg-gray-50"}>
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className="border border-gray-300 p-2 bg-white"
                      style={
                        row.isHeader
                          ? {
                              backgroundColor: headerColor,
                              color: "white",
                            }
                          : {}
                      }>
                      <textarea
                        rows={1}
                        value={row.data[col.id] || ""}
                        onChange={(e) =>
                          updateCell(row.id, col.id, e.target.value)
                        }
                        onInput={(e) => {
                          // auto-grow for multi-line cells
                          e.target.style.height = "auto";
                          e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        className="w-full p-2 text-center outline-none bg-transparent font-medium resize-none overflow-hidden"
                        style={
                          row.isHeader
                            ? {
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "15px",
                              }
                            : {
                                color: "#1f2937",
                              }
                        }
                      />
                    </td>
                  ))}
                  <td className="border border-gray-300 p-2 text-center bg-white">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => insertRowAfter(row.id)}
                        className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                        title="افزودن ردیف بعد از این ردیف">
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => toggleRowHeader(row.id)}
                        className={`${
                          row.isHeader
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-gray-500 hover:bg-gray-600"
                        } text-white p-2 rounded transition`}
                        title={
                          row.isHeader
                            ? "تبدیل به ردیف عادی"
                            : "تبدیل به هدر"
                        }>
                        <AlignJustify size={16} />
                      </button>
                      {rows.length > 1 && (
                        <button
                          onClick={() => deleteRow(row.id)}
                          className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* بخش نکات */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-right text-gray-800">
              📝 نکات مهمم
            </h2>
            <button
              onClick={addNote}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-bold">
              <Plus size={18} />
              افزودن نکته
            </button>
          </div>
          <div className="space-y-3">
            {notes.length === 0 ? (
              <p className="text-gray-500 text-right">
                هنوز نکته‌ای اضافه نشده است. روی دکمه "افزودن نکته"
                کلیک کنید.
              </p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-blue-600 font-bold mt-2">
                    •
                  </span>
                  <input
                    type="text"
                    value={note.text}
                    onChange={(e) =>
                      updateNote(note.id, e.target.value)
                    }
                    className="flex-1 p-2 border-2 border-gray-300 rounded-lg text-right text-gray-900 font-medium focus:border-blue-500 focus:outline-none bg-white"
                  />
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* فوتر */}
        <div
          className="mt-6 rounded-lg shadow-lg p-4 text-center"
          style={{ background: "#012710" }}>
          <div className="flex justify-center gap-6 flex-wrap text-white text-sm font-medium">
            <span>🌐 {website}</span>
            <span>📱 {whatsapp}</span>
            <span>📧 {email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
