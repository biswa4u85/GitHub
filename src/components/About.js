import { Space, Tag } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { ReadOutlined, StarOutlined, ForkOutlined } from "@ant-design/icons";
import Image from "next/image";
// import { RepoContext } from "./RepoContext";
import { GitContext } from "@/pages/context";
import { accessToken } from "./branch_utilis";
import {
  fetchContributors,
  fetchLatestReleaseData,
  fetchProgressData,
} from "@/pages/api/api";
export default function About() {
  const { searchTerm, repoSearchData, repositories } = useContext(GitContext);
  const [contributors, setContributors] = useState([]);
  const [releaseData, setReleaseData] = useState({
    releaseCount: 0,
    latestRelease: null,
  });
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchContributors(searchTerm, accessToken)
      .then((data) => {
        setContributors(data);
      })
      .catch((error) => {
        console.error("Error fetching contributors:", error);
      })
      .finally(() => {
        setLoading(false);
      });
    fetchLatestReleaseData(searchTerm, accessToken).then((data) => {
      setReleaseData(data);
      setLoading(false);
    });
    fetchProgressData(searchTerm, accessToken)
      .then((data) => {
        setProgressData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [repoSearchData]);
  const aboutIconsData = [
    {
      icon: <ReadOutlined style={{ fontSize: "16px" }} />,
      text: "Read Me",
    },
    {
      icon: <Image src="/Balance.svg" alt="" width={16} height={16} />,
      text: "Unlicensed licence",
    },
    {
      icon: <StarOutlined />,
      text: repoSearchData?.stargazers_count
        ? `${repoSearchData.stargazers_count} stars`
        : "No stars",
    },
    {
      icon: <ForkOutlined style={{ fontSize: "16px" }} />,
      text: repoSearchData?.forks_count
        ? `${repoSearchData.forks_count} forks`
        : "No forks",
    },
  ];
  return (
    <div>
      {repoSearchData && (
        <div className="about_mainPage">
          <div className="about_page">
            <div className="about_title">About</div>
            <div className="about_text">
              {repoSearchData ? (
                repoSearchData?.description
              ) : (
                <div>No description</div>
              )}
            </div>
            <div className="about_tag_div">
              <Space size={[0, 6]} wrap>
                {repoSearchData ? (
                  repoSearchData?.topics?.map((tag, index) => (
                    <Tag key={index} className="about_tag">
                      {tag}
                    </Tag>
                  ))
                ) : (
                  <Tag className="about_tag">No Tags</Tag>
                )}
              </Space>
            </div>
            <div className="about_icons_div">
              {aboutIconsData.map((item, index) => (
                <div key={index} className="about_icons_div_divs">
                  {item.icon}
                  <text>{item.text}</text>
                </div>
              ))}
            </div>
          </div>
          <div className="release">
            <div className="release_title">
              <span>Release</span>
              <span className="releaseCount">{releaseData.releaseCount}</span>
            </div>
            <div className="release_tag">
              <div className="release_icon_div">
                <Image src="/Tag.svg" alt="" width={16} height={16} />
                <span style={{ color: "#C9D1D9" }}>
                  {loading
                    ? "Loading..."
                    : releaseData.latestRelease
                    ? releaseData.latestRelease.tag_name
                    : "No releases"}
                </span>
                <span className="release_latest">Latest</span>
              </div>
            </div>
            {releaseData?.releaseCount ? (
              <div className="releaseCount_data">
                + {releaseData.releaseCount - 1} releases
              </div>
            ) : (
              <div className="releaseCount_data">
                + {releaseData.releaseCount} releases
              </div>
            )}
          </div>
          <div className="packages">
            <div className="package_title">Packages</div>
            <div className="package_text">No packages published</div>
          </div>
          <div className="contributors">
            <div className="contributors_title_div">
              <span className="contributor_title">Contributors</span>
              <span className="contributor_count">{contributors.length}</span>
            </div>
            <div className="contributorsImg_div">
              <div className="contributors_div_div">
                {contributors.slice(0, 11).map((contributor) => (
                  <div key={contributor.id}>
                    <img
                      className="contributors_img"
                      src={contributor.avatar_url}
                      alt={contributor.login}
                    />
                  </div>
                ))}
              </div>
              <div className="moreContributors">
                {contributors.length > 11 && (
                  <div>+{contributors.length - 11} contributors</div>
                )}
              </div>
            </div>
          </div>
          <div className="language">
            <div className="lang_title">Languages</div>
            <div className="lang_progressBar">
              {progressData.map(({ language, percentage, color }) => (
                <div
                  key={language}
                  style={{
                    backgroundColor: color,
                    width: `${percentage}%`,
                  }}
                />
              ))}
            </div>
            <div>
              <div className="lang_names">
                {progressData.map(({ language, percentage, color }) => (
                  <ul key={language} className="lang_percentage">
                    <li
                      className="lang_li"
                      style={{
                        color: color,
                      }}
                    >
                      <span className="lang_name_title">{language}</span>
                      <span className="lang_name_percent">{`${percentage.toFixed(
                        1
                      )}%`}</span>
                    </li>
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
