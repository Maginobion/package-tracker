import { useState } from "react";
import { PackageService } from "../services";

const IndexPage = () => {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (abortController) {
      abortController.abort();
    }

    const newController = new AbortController();
    setAbortController(newController);

    PackageService.getPackage(search, newController.signal)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setAbortController(null);
      });
  };

  return (
    <>
      <main className="bg-gray-800 text-white rounded-md p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Package Tracker</h1>
        <form onSubmit={handleSubmit}>
          <input
            value={search}
            onChange={handleSearch}
            className="border border-gray-300 rounded-md p-2"
            placeholder="Search for a package"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-2"
          >
            Search
          </button>
        </form>
      </main>
    </>
  );
};

export default IndexPage;
