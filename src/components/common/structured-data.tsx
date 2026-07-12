import React from 'react';

/**
 * Renders JSON‑LD structured data safely.
 * Pass a plain JavaScript object; it will be stringified and inserted
 * as a <script type="application/ld+json"> tag.
 */
export const StructuredData: React.FC<{ data: Record<string, any> }> = ({ data }) => {
  const json = JSON.stringify(data);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
};
