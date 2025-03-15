import axios from 'axios'
import './App.css'
import Navbar from './Components/Navbar'
import Signin from './Pages/Signin'
import { useState } from 'react';

function downloadExcel(category: string) {
  

  axios.post("http://localhost:3000/seller/download_excel", 
    { category: category }, // Request body
    {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'blob' // Important: This tells Axios to return a Blob
    }
  )
  .then(response => {
    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${category}-template.xlsx`; // Downloaded file name
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
  })
  .catch(error => console.error("Error downloading Excel:", error));
}

const uploadfile = async (file: any) =>{
  if(!file) {
    console.error("File not found");
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    await axios.post("http://localhost:3000/seller/upload_documents",formData,{
      headers:{
        "Content-Type": "multipart/form-data", // Required for file uploads
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsImlhdCI6MTc0MjA1NzU2OCwiZXhwIjoxNzQyMDU3ODY4fQ.4_cgVbMm21IU4ivQtYwKV77eyt29_vwR3WqnpatZwmw" 
      }
    })
    console.log("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}


function App() {

  const [selectedOption, setSelectedOption] = useState("");
  const [selectedfile, setSelectedfile] = useState<File | null>(null);

  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedfile(file);
  };
  

  return (
    <div className='flex mt-5 justify-center h-full'>
      {/* <Navbar/> */}
      {/* <Signin/> */}
      <div className="p-5">
        <h1 className='text-xl mb-5'>To download the excel based on category: </h1>
      <select value={selectedOption} onChange={handleSelectChange}>
        <option value="saree">Saree</option>
        <option value="tShirt">tShirt</option>
        <option value="jeans">Jeans</option>
        <option value="kurti">kurti</option>
        <option value="other">Other</option>
      </select>
      <button className='pl-5 cursor-pointer hover:text-red-400'  onClick={() => downloadExcel(selectedOption)}>Click to download Excel sheet</button>
      </div>

      <div className="p-5">
        <h1 className='text-xl mb-5'>To Upload the excel file by seller</h1>
        <input className='hover:text-red-400 cursor-pointer' type="file" name="excel"  id="ex1" onChange={handleFileChange} />
        <div className="flex items-center justify-center mt-3">
        <button className='hover:text-red-400 cursor-pointer' onClick={() => uploadfile(selectedfile)}>Upload the file</button>
        </div>
      </div>

      {/* <button onClick={() => downloadExcel(selectedOption)}>Click to download Excel sheet</button> */}
    </div>
  )
}

export default App
