import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCompanies } from "../../../service/CompaniesService";
import { getProvinces } from "../../../service/ProvincesService";
import Swal from "sweetalert2";
import MenuCompanies from "../mol-companies/MenuCompanies";
import * as XLSX from "xlsx";

const MolExcelSheetJs = () => {

  const [name, setName] = useState("");
  const [ubication, setUbication] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [priority, setPriority] = useState("");
  const [province_id, setProvince_id] = useState(0);
  const [provinces, setProvinces] = useState([]);

  const navigate = useNavigate();

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // assuming first row is header
      const header = rows[0];
      const rowsData = rows.slice(1).map((row) => {
        return header.reduce((acc, curr, index) => {
          acc[curr] = row[index];
          return acc;
        }, {});
      });
      // Assuming column names in excel are: name, lat, long, iso
      rowsData.forEach(async (rowData) => {
        
        const formData = new FormData();
        formData.append("name", rowData.name);
        formData.append("ubication", rowData.ubication);
        formData.append('email', rowData.email ? rowData.email.toString() : '');
        formData.append("phone", rowData.phone);
        formData.append("priority", rowData.priority);
        formData.append("province_id", parseInt(rowData.province_id));
        try {
          const { data } = await createCompanies(formData);
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "¡Tus datos se han añadido con éxito!",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        navigate("/regioncreate");
      }, 2000); // Delay the navigation for 2 seconds (2000 milliseconds)
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {

      const formData = new FormData();
      formData.append('name', name);
      formData.append('ubication', ubication);
      formData.append('email', email.toString());
      formData.append('phone', phone);
      formData.append('priority', priority);
      formData.append('province_id', parseInt(province_id));
       

      const { data } = await createCompanies(formData);
      console.log(data);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "¡Tu empresa se ha añadido con éxito!",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        navigate("/companiestable");
      }, 2000);
    } catch (error) {
      console.log(error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "¡Ha habido un problema, prueba de nuevo!",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  useEffect(() => {
    getProvinces()
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => console.error(error));
  }, []);



  return (
    <>
    <MenuCompanies/>
      <div className="bg-stone6 w-full max-w-screen-lg rounded-xl p-20 m-20">
        <h2 className="text-2xl font-semibold leading-7 text-orange">Añadir empresa</h2>

        <form className="bg-stone6" onSubmit={handleSubmit}>
          <div className="mt-10 space-y-8 border-b border-orange pb-12 sm:space-y-0 sm:divide-y sm:divide-orange sm:border-t sm:pb-0">
            
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label
                htmlFor="company-name"
                className="block text-sm font-medium leading-6 text-white sm:pt-1.5"
              >
                Nombre de la empresa <span className="text-orange">*</span>
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Inserte nombre de la empresa."
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5  text-stone6 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label
                htmlFor="company-location"
                className="block text-sm font-medium leading-6 text-white sm:pt-1.5"
              >
                Dirección de la empresa <span className="text-orange">*</span>
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="ubication"
                  id="ubication"
                  value={ubication}
                  onChange={(event) => setUbication(event.target.value)}
                  placeholder="Inserte ubicación de la empresa."
                  autoComplete="given-ubication"
                  className="block w-full rounded-md border-0 py-1.5  text-stone6 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="province" className="block text-sm font-medium leading-6 text-white sm:pt-1.5">
                Provincia <span className="text-orange">*</span>
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <select
                  name="province_id"
                  id="province_id"
                  value={province_id}
                  onChange={(event) => setProvince_id(event.target.value)}
                  className="block w-full rounded-md border-0 py-1.5  text-stone6 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  {provinces.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label
                htmlFor="company-email"
                className="block text-sm font-medium leading-6 text-white sm:pt-1.5"
              >
                Email de la empresa <span className="text-orange">*</span>
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Inserte email de la empresa."
                  autoComplete="given-email"
                  className="block w-full rounded-md border-0 py-1.5  text-stone6 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label
                htmlFor="comany-phone"
                className="block text-sm font-medium leading-6 text-white sm:pt-1.5"
              >
                Teléfono de la empresa <span className="text-orange">*</span>
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Inserte télefono de la empresa."
                  autoComplete="given-phone"
                  className="block w-full rounded-md border-0 py-1.5  text-stone6 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="priority" className="block text-sm font-medium leading-6 text-white sm:pt-1.5">
                Prioridad de la empresa <span className="text-orange">*</span>
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <select
                  name="priority"
                  id="priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  className="block w-full rounded-md border-0 py-1.5  text-stone6 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >                 
                    <option key={1} value="1">
                      Alta
                    </option>
                    <option key={2} value="2">
                      Media
                    </option>
                    <option key={3} value="3">
                      Baja
                    </option>
                  
                </select>
              </div>
            </div>            
          </div>
          <button
            type="submit"
            className="text-sm my-10 px-24 py-3.5 rounded-xl bg-gradient-to-r from-orange to-orangel hover:from-verde hover:to-verdel ..."
          >
            Crear empresa
          </button>
          <button
            className="text-sm my-10 mx-10 px-24 py-3.5 rounded-xl bg-gradient-to-r from-orangel to-orange hover:from-verde hover:to-verdel ..."
            type="button"
          >
            <a href="/companiestable">Ver empresas</a>
          </button>
        </form>
        <div className="form-group">
         <label htmlFor="excel"></label>
         <input className=" text-white" type="file" id="excel" name="excel" onChange={handleExcelUpload} accept=".xlsx" />
         </div>
      </div>
    </>
  );
};

export default MolExcelSheetJs;
