import { FaMagnifyingGlass } from "react-icons/fa6";
import { ProjectsData } from "../types";
import React, { ChangeEvent, MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import Layout from "../components/Layout";
import { projects } from "../lib";
import { FaExternalLinkAlt } from "react-icons/fa";

const badges = Array.from(new Set(projects.flatMap((project) => project.tools)));
const categories = ["all categories", "laravel", "wordpress", "reactjs"];
const sort = ["default", "asc", "desc"] as const;

export default function Projects() {
  const { t } = useTranslation();

  const [cari, setCari] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  // const [openAcc, setOpenAcc] = useState<number | null>(null);
  const [selectedSort, setSelectedSort] = useState<(typeof sort)[number]>("default");

  const filteredProjects = projects
    .filter(
      (item) =>
        item["domain-name"].toLowerCase().includes(cari.toLowerCase()) ||
        item.tools.some((tool) => tool.toLowerCase().includes(cari.toLowerCase()))
    )
    .filter((item) => item.tools[0].toLowerCase().includes(selectedCategory.toLowerCase()))
    .filter((item) => selectedBadge.every((badge) => item.tools.includes(badge)));
  // .sort((a, b) => a["domain-name"].toLowerCase().localeCompare(b["domain-name"].toLowerCase()));

  if (selectedSort === "asc")
    filteredProjects.sort((a, b) => a["domain-name"].toLowerCase().localeCompare(b["domain-name"].toLowerCase()));
  if (selectedSort === "desc")
    filteredProjects.sort((a, b) => b["domain-name"].toLowerCase().localeCompare(a["domain-name"].toLowerCase()));

  const onBadge = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const badge: string = target?.innerText;
    if (selectedBadge.includes(badge)) {
      setSelectedBadge((prev) => prev.filter((p) => p !== badge));
    } else setSelectedBadge((prev) => [...prev, badge]);
  };

  const onCategory = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(e.target.value as (typeof categories)[number]);
  };

  const onSort = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const newSort: (typeof sort)[number] = target?.innerText as (typeof sort)[number];
    setSelectedSort(newSort);
  };

  return (
    <Layout>
      <Helmet>
        <title>{t("meta.projects.title")}</title>
        <meta name="description" content={`${t("meta.projects.description")}`} />
      </Helmet>
      <div className="container py-8">
        {/* Title and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold min-w-max">All Projects</h1>
          <div className="relative flex items-center gap-4 w-full sm:w-64">
            <input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              type="text"
              className="border rounded-lg py-2 px-4 pr-10 focus:outline-none w-full"
              placeholder="Search here.."
            />
            <FaMagnifyingGlass className="absolute text-gray-300 text-lg m-3 right-0" />
          </div>
        </div>
        <div className="relative space-y-2">
          {/* category */}
          <div className="flex items-center overflow-x-scroll gap-1">
            <div className="flex gap-1">
              {categories.map((item, i) => (
                <React.Fragment key={i}>
                  <input
                    type="radio"
                    name="category"
                    value={item === "all categories" ? "" : item}
                    id={item}
                    onChange={onCategory}
                    className="hidden"
                  />
                  <label
                    htmlFor={item}
                    className={`${
                      selectedCategory === (item === "all categories" ? "" : item) ? "bg-blue-500 text-white" : ""
                    } badge`}
                  >
                    {item}
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>
          {/* tags */}
          <div className="flex items-center overflow-x-scroll gap-1">
            {/* Blur effect on the right */}
            <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white via-white/60 to-transparent pointer-events-none"></div>{" "}
            <button type="button" onClick={() => setSelectedBadge([])} className="badge">
              Reset Tags
            </button>
            <div className="gap-1 flex">
              {badges.map((item, i) => (
                <button
                  type="button"
                  key={i}
                  className={`${selectedBadge.includes(item) ? "bg-blue-500 text-white" : ""} badge`}
                  onClick={onBadge}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          {/* sort */}
          <div className="flex items-center overflow-x-scroll gap-1">
            {sort.map((item, i) => (
              <button
                type="button"
                key={i}
                className={`${selectedSort === item ? "bg-blue-500 text-white" : ""} badge`}
                onClick={onSort}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <br />
        <hr />
        {/* No result */}
        {filteredProjects.length === 0 && <div className="py-8 italic">{t("other.no-result")}</div>}

        {/* Result */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 lg:gap-4">
          {filteredProjects.map((project: ProjectsData, i) => (
            <div
              key={i}
              // onMouseEnter={() => setOpenAcc(i)}
              // onMouseLeave={() => setOpenAcc(null)}
              className="border rounded-md p-2 overflow-x-scroll"
            >
              <div className="title flex flex-col items-center space-y-2">
                <a
                  href={`https://${project["domain-name"]}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-blue-900 hover:underline"
                >
                  <h3 className="text-center font-semibold">
                    {project["domain-name"]}
                    <sup>
                      <FaExternalLinkAlt className="inline-block ml-1 text-[10px]" />
                    </sup>
                  </h3>
                </a>
                <p className="text-sm text-center text-gray-500">{project.tools.join(" - ")}</p>

                {/* <FaChevronDown className={`${openAcc === i ? "rotate-180" : ""} transition-all`} /> */}
              </div>
              {/* <div className={`${openAcc === i ? "active" : ""} overflow-hidden acc-project-desc transition-all`}>
                <p className="mt-2">{project["web-description"]}</p>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
