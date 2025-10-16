import type { Package } from "@common/types/packages/package.types";
import { isAxiosError } from "axios";
import { useState } from "react";
import PackageDetails from "../components/PackageSearch/PackageDetails";
import { PackageService } from "../services";

const IndexPage = () => {
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const [data, setData] = useState<Package | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (abortController) {
      abortController.abort();
    }

    const newController = new AbortController();
    setAbortController(newController);

    PackageService.getPackage(search, newController.signal)
      .then((data) => {
        setData(data);
        setError(null);
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          setError(error.response?.data.message);
        } else {
          setError("An unknown error occurred. Please try again.");
        }
        setData(null);
        console.error(error);
      })
      .finally(() => {
        setAbortController(null);
      });
  };

  return (
    <>
      <main className="bg-gray-800 text-white rounded-md p-6 flex flex-col gap-6 mx-2">
        <h1 className="text-2xl font-bold">Package Tracker</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            value={search}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2"
            placeholder="Search for a package"
          />
          <p className="text-red-500">{error}</p>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-2"
          >
            Search
          </button>
        </form>
        {data && (
          <div className="mt-2">
            <PackageDetails data={data} />
          </div>
        )}
      </main>
    </>
  );
};

export default IndexPage;
