import { getDictionary } from "@repo/internationalization";
import type { ReactNode } from "react";
import { Footer } from "../_components/footer";
import { Header } from "../_components/header";

interface SiteLayoutProperties {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
}

const SiteLayout = async ({ children, params }: SiteLayoutProperties) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <>
      <Header dictionary={dictionary} />
      {children}
      <Footer locale={locale} />
    </>
  );
};

export default SiteLayout;
