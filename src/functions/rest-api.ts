import { API_KEY } from "../config/config";
import axios from "axios";
import { GameMapV2, Space } from "@gathertown/gather-game-client";
//These endpoints taken from the documentation @

export const createSpace = async (
  spaceName: string,
  spaceTemplateURL: string,
  spaceReason: string
) => {
  const urlParser = spaceTemplateURL.split("/");
  const { status, data } = await axios({
    method: "POST",
    url: "https://api.gather.town/api/v2/spaces",
    data: {
      name: spaceName,
      sourceSpace: [urlParser[4], urlParser[5]].join("\\"),
      reason: spaceReason,
    },
    headers: {
      apiKey: API_KEY,
    },
  });

  return `https://app.gather.town/app/${data}`;
};

export const getSpace = async (spaceURL: string) => {
  const urlParser = spaceURL.split("/");
  const { status, data } = await axios({
    method: "GET",
    url: `https://api.gather.town/api/v2/spaces/${encodeURIComponent(
      [urlParser[4], urlParser[5]].join("\\")
    )}`,
    headers: {
      apiKey: API_KEY,
    },
  });

  return data as Space;
};

export const getMap = async (spaceURL: string, mapID: string) => {
  const urlParser = spaceURL.split("/");
  const { status, data } = await axios({
    method: "GET",
    url: `https://api.gather.town/api/v2/spaces/${encodeURIComponent(
      [urlParser[4], urlParser[5]].join("\\")
    )}/maps/${encodeURIComponent(mapID)}`,
    headers: {
      apiKey: API_KEY,
    },
  });

  return data as GameMapV2;
};

export const setMap = async (
  spaceURL: string,
  mapID: string,
  newMapData: Partial<GameMapV2>
) => {
  const urlParser = spaceURL.split("/");
  const { status, data } = await axios({
    method: "GET",
    url: `https://api.gather.town/api/v2/spaces/${encodeURIComponent(
      [urlParser[4], urlParser[5]].join("\\")
    )}/maps/${encodeURIComponent(mapID)}`,
    data: {
      content: {
        newMapData,
      },
    },
    headers: {
      apiKey: API_KEY,
    },
  });
};
