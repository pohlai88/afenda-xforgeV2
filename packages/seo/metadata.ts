import merge from "lodash.merge";
import type { Metadata } from "next";
import {
  AFENDA_SITE_ICONS,
  afendaSiteIconsMetadata,
} from "./afenda-site-icons";

type MetadataGenerator = Omit<Metadata, "description" | "title"> & {
  title: string;
  description: string;
  image?: string;
};

const applicationName = "Afenda";
const author: Metadata["authors"] = {
  name: "Afenda",
  url: "https://afenda.com/",
};
const publisher = "Afenda";
const twitterHandle = "@afenda";
const defaultDescription =
  "Governance-first ERP foundation for tenant-scoped business systems.";
const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const createMetadata = ({
  title,
  description,
  image,
  ...properties
}: MetadataGenerator): Metadata => {
  const parsedTitle = `${title} | ${applicationName}`;
  const defaultMetadata: Metadata = {
    title: parsedTitle,
    description: description || defaultDescription,
    applicationName,
    metadataBase: productionUrl
      ? new URL(`${protocol}://${productionUrl}`)
      : undefined,
    authors: [author],
    creator: author.name,
    formatDetection: {
      telephone: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: applicationName,
    },
    icons: afendaSiteIconsMetadata(),
    manifest: AFENDA_SITE_ICONS.manifest,
    openGraph: {
      title: parsedTitle,
      description,
      type: "website",
      siteName: applicationName,
      locale: "en_US",
    },
    publisher,
    twitter: {
      card: "summary_large_image",
      creator: twitterHandle,
    },
  };

  const metadata: Metadata = merge(defaultMetadata, properties);

  if (image && metadata.openGraph) {
    metadata.openGraph.images = [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      },
    ];
  }

  return metadata;
};
