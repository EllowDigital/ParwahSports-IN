import { Helmet } from "react-helmet-async";

const CANONICAL_DOMAIN = "https://parwahsports.com";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  type?: "website" | "article";
  image?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function SEOHead({
  title,
  description,
  path,
  keywords,
  type = "website",
  image = "/logo.png",
  noindex = false,
  jsonLd,
}: SEOHeadProps) {
  const canonicalUrl = `${CANONICAL_DOMAIN}${path}`;
  const fullTitle = title.includes("Parwah Sports") ? title : `${title} | Parwah Sports`;
  const imageUrl = image.startsWith("http") ? image : `${CANONICAL_DOMAIN}${image}`;

  // BreadcrumbList schema
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: CANONICAL_DOMAIN },
      ...(path !== "/"
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: title.split("|")[0].trim(),
              item: canonicalUrl,
            },
          ]
        : []),
    ],
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Parwah Sports Charitable Trust" />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      {jsonLd &&
        (Array.isArray(jsonLd)
          ? jsonLd.map((ld, i) => (
              <script key={i} type="application/ld+json">
                {JSON.stringify(ld)}
              </script>
            ))
          : (
              <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            ))}
    </Helmet>
  );
}
