import { useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import Pagination from "./Pagination";
import axios from "axios";

function App() {
  const inputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [isShowing, setIsShowing] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);

  const getUsers = (keyword, page) => {
    setLoading(true);
    setUsers([]);
    setError(null);
    axios
      .get<Post[]>(
        `https://api.github.com/search/users?q=${keyword}&per_page=${rowsPerPage}&page=${page}`
      )
      .then((response) => {
        setTotalRows(response.data.total_count);
        const pages = Math.ceil(response.data.total_count / rowsPerPage);
        setTotalPages(pages);
        response.data.items.map((user) => ({
          ...user,
          expanded: false,
          loading: false,
          repositories: [],
          error: null,
        }));
        setUsers(response.data.items);
        setLoading(false);
      })
      .catch((err) => {
        const errorMessage = err?.response?.data?.message ?? err.message;
        setError(errorMessage);
        setLoading(false);
      });
  };

  const getRepositories = (user) => {
    axios
      .get<Post[]>(`https://api.github.com/users/${user.login}/repos`)
      .then((response) => {
        users.map((u) => {
          if (u.id === user.id) {
            u.loading = false;
            u.repositories = response.data;
          }
        });
        setUsers([...users]);
      })
      .catch((err) => {
        const errorMessage = err?.response?.data?.message ?? err.message;
        users.map((u) => {
          if (u.id === user.id) {
            u.loading = false;
            u.repositories = [];
            u.error = errorMessage;
          }
        });
        setUsers([...users]);
      });
  };

  const onSearch = () => {
    const currentValue = inputRef.current.value;
    setSearchValue(currentValue);

    if (currentValue.length === 0) {
      setIsShowing(false);
      setUsers([]);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalRows(0);
    } else {
      setIsShowing(true);
      getUsers(currentValue, 1);
    }
  };

  const handleClickOnUser = (user) => {
    users.map((u) => {
      if (u.id === user.id) {
        u.expanded = !u.expanded;

        if (u.expanded) {
          u.loading = true;
          getRepositories(user);
        } else {
          u.loading = false;
        }
      }
    });
    setUsers([...users]);
  };

  const onPageChange = (page) => {
    if (page === "...") return;

    setCurrentPage(page);
    getUsers(searchValue, page);
  };

  return (
    <div className="max-w-md w-full mx-auto p-5 flex flex-col gap-3">
      <input
        type="text"
        ref={inputRef}
        placeholder="Enter username"
        className="w-full p-2 border border-gray-200 rounded-md"
      />
      <button
        onClick={() => onSearch()}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Search
      </button>
      {isShowing && <div>Showing users for "{searchValue}"</div>}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">Error: {error}</div>
        ) : users.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            No users available
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id}>
              <div
                className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer"
                onClick={() => handleClickOnUser(user)}
              >
                <div>{user.login}</div>
                <div>
                  {user.expanded ? (
                    <ChevronDownIcon className="h-6 w-6 text-gray-600" />
                  ) : (
                    <ChevronUpIcon className="h-6 w-6 text-gray-600" />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-3 ">
                {user.expanded && user.loading ? (
                  <div className="bg-gray-200 ml-4 text-center p-4">
                    Loading...
                  </div>
                ) : user.expanded && user.error ? (
                  <div className="bg-gray-200 ml-4 text-center p-4 text-red-500">
                    Error: {user.error}
                  </div>
                ) : user.expanded && user.repositories.length === 0 ? (
                  <div className="bg-gray-200 ml-4 text-center p-4 text-gray-500">
                    No repositories available
                  </div>
                ) : (
                  user.expanded &&
                  user.repositories.length > 0 &&
                  user.repositories.map((repo, index) => (
                    <div
                      key={repo.id}
                      className="flex flex-col p-2 bg-gray-200 ml-4 gap-2"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-semibold">{repo.name}</div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">
                            {repo.stargazers_count}
                          </span>
                          <StarIcon className="h-6 w-6 font-semibold" />
                        </div>
                      </div>
                      <div>{repo.description}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        totalRows={totalRows}
        onPageChange={onPageChange}
        users={users}
      />
    </div>
  );
}

export default App;
