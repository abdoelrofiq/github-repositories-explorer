import { useState, useRef, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersRequest } from "./redux/userSlice";
import { RootState, AppDispatch } from "./redux/store";
import Status from "./redux/status";

function App() {
  const inputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [isShowing, setIsShowing] = useState(false);
  const [users_, setUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch<AppDispatch>();
  const { users, totalRows, loading, error, status } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    if (status === Status.Finish) {
      setUsers([...users]);
    }
  }, [status]);

  const getUsers = (keyword, page) => {
    dispatch(fetchUsersRequest({ keyword, perPage: rowsPerPage, page }));
  };

  const getRepositories = (user) => {
    axios
      .get<Post[]>(`https://api.github.com/users/${user.login}/repos`)
      .then((response) => {
        const updatedUsers = users_.map((u) => {
          if (u.id === user.id) {
            return {
              ...u,
              expanded: true,
              loading: false,
              repositories: response.data,
              error: null,
            };
          }

          return u;
        });
        setUsers([...updatedUsers]);
      })
      .catch((err) => {
        const errorMessage = err?.response?.data?.message ?? err.message;
        const updatedUsers = users_.map((u) => {
          if (u.id === user.id) {
            return {
              ...u,
              expanded: true,
              loading: false,
              repositories: [],
              error: errorMessage,
            };
          }

          return u;
        });
        setUsers([...updatedUsers]);
      });
  };

  const onSearch = () => {
    const currentValue = inputRef.current.value;
    setSearchValue(currentValue);
    setUsers([]);
    setCurrentPage(1);

    if (currentValue.length === 0) {
      setIsShowing(false);
    } else {
      setIsShowing(true);
      getUsers(currentValue, 1);
    }
  };

  const handleClickOnUser = (user) => {
    const updatedUsers = users_.map((u) => {
      if (u.id === user.id) {
        const expanded = !u.expanded;

        if (expanded) {
          getRepositories(user);
        }

        return {
          ...u,
          expanded,
          loading: expanded ? true : false,
        };
      }

      return u;
    });
    setUsers([...updatedUsers]);
  };

  const onPageChange = (page) => {
    if (status === Status.Idle && error != null) return;
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
        ) : isShowing && error ? (
          <div className="text-center p-4 text-red-500">Error: {error}</div>
        ) : users_.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            No users available
          </div>
        ) : (
          users_.map((user) => (
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

      {isShowing && (
        <Pagination
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          totalRows={totalRows}
          onPageChange={onPageChange}
          users={users}
        />
      )}
    </div>
  );
}

export default App;
