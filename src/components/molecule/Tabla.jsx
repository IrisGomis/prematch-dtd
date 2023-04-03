import axios from "axios";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000/api";



export default function TableEvent() {
  
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [event, setEvent] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/events`)
      .then((response) => {
        setEvent(response.data);
        setSelectedEvent(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedEvent.length > 0 && selectedEvent.length < event.length;
    setChecked(selectedEvent.length === event.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedEvent, event]);
  
  function toggleAll() {
    setSelectedEvent(checked || indeterminate ? [] : selectedEvent)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  function handleDelete() {
    if (selectedEvent.length === 0) {
      console.error("No events selected to delete");
      return;
    }

    // Create an array of promises to delete each selected event
    const deletePromises = selectedEvent.map((event) =>
      axios.delete(`${API_BASE_URL}/events/${event.id}`)
    );

    // Delete all events in parallel
    Promise.all(deletePromises)
      .then((responses) => {
        console.log("Events deleted successfully!");
        // Remove all deleted events from the event state
        const deletedIds = selectedEvent.map((event) => event.id);
        setEvent(event.filter((e) => !deletedIds.includes(e.id)));
        // Clear the selectedEvent state
        setSelectedEvent([]);
        setChecked(false);
        setIndeterminate(false);
      })
      .catch((error) => {
        console.error(`Error deleting events: ${error.message}`);
      });
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 bg-stone4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Eventos
          </h1>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative ">
              {selectedEvent.length > 0 && (
                <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                  <button
                    type="button"
                    className="inline-flex items-center rounded bg-white px-20 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    onClick={() => handleDelete(selectedEvent[0].id)}
                  >
                    Eliminar
                  </button>
                </div>
              )}
              <table className="min-w-full table-fixed divide-y divide-gray-300 mt-6">
                <thead>
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th
                      scope="col"
                      className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 mt-5"
                    >
                      Nombre
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Url
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Fecha
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Num-Min-Ent
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Num-Max-Ent
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                    >
                      <span className="sr-only">Editar</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {event.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-7 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          name={e.id}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedEvent.some((ev) => ev.id === e.id)}
                          onChange={(event) => {
                            const isChecked = event.target.checked;
                            setSelectedEvent((prevState) => {
                              if (isChecked) {
                                return [...prevState, e];
                              } else {
                                return prevState.filter((ev) => ev.id !== e.id);
                              }
                            });
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {e.name}
                        </div>
                        <div className="text-sm text-gray-500">{e.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{e.url}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {e.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {e.min}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {e.max}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/edit/${e.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <button
                  type="submit"
                  className="rounded-md bg-orange py-4 px-20 text-sm font-semibold text-white shadow-sm hover:bg-orangel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <Link
                    to={"/"}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Crear Evento
                  </Link>
                </button>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}