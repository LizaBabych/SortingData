import "./App.css";
import { useEffect, useState } from "react";
import { fetchDate } from "./api/getData";

const URL = "https://randomuser.me/api/?results=20";

const App = () => {
  const [locations, setLocations] = useState([]);
  const [defaultData, setDefaultData] = useState([]);
  const [headers, setHeaders] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  const splitLocation = (personLocations) => {
    const data = [];
    personLocations.forEach(({ coordinates, street, timezone, ...rest }) => {
      data.push({
        ...rest,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        name: street.name,
        number: street.number,
        offset: timezone.offset,
        description: timezone.description,
      });
    });
    return data;
  };

  useEffect(() => {
    fetchDate(URL).then((response) => {
      const peopleLocation = splitLocation(response.map((val) => val.location));
      setDefaultData(peopleLocation);
      setLocations(peopleLocation);
      let directions = {};
      Object.keys(peopleLocation[0]).map(
        (head) =>
          (directions = {
            ...directions,
            [head]: "default",
          })
      );
      setHeaders(directions);
      setLoading(false);
    });
  }, []);

  const sortValue = (value) => {
    let peopleLocation = [...locations];
    let directions = { ...headers };
    if (headers[value] === "default") {
      peopleLocation.sort((a, b) => {
        if (a[value] < b[value]) return -1;
        if (a[value] > b[value]) return 1;
        return a[value] - b[value];
      });
      directions[value] = "up";
    }
    if (headers[value] === "up") {
      peopleLocation.sort((a, b) => {
        if (a[value] > b[value]) return -1;
        if (a[value] < b[value]) return 1;
        return 0;
      });
      directions[value] = "down";
    }
    if (headers[value] === "down") {
      directions[value] = "default";
      peopleLocation = defaultData;
    }
    setHeaders(directions);
    setLocations(peopleLocation);
  };

  const setIconClass = (direction) => {
    if (direction === "up") return "-up";
    if (direction === "down") return "-down";
    return "";
  };

  const findSearchingValues = (data, searchingWord) => {
    return data.filter((row) => {
      return Object.values(row).some((s) =>
        s.toString().toLowerCase().includes(searchingWord)
      );
    });
  };

  return (
    <div className="App">
      <h1>People Locations</h1>
      <input
        type="text"
        value={inputValue}
        placeholder="Search"
        onChange={(e) => setInputValue(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            {!isLoading &&
              Object.keys(headers).map((val, valIdx) => (
                <th key={valIdx} onClick={() => sortValue(val)}>
                  <span>{val}</span>
                  <i className={`fas fa-sort${setIconClass(headers[val])}`} />
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {!isLoading &&
            findSearchingValues(locations, inputValue).map((data, dataIdx) => (
              <tr key={dataIdx}>
                {Object.values(data).map((val, valIdx) => (
                  <td key={valIdx}>{val}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
