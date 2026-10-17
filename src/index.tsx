import { Hono } from "hono";
import { loadContent } from "./content";
import { Document, FloatingCta, Footer, Header } from "./components/layout";
import { Access, Availability, Facility, FaqList, Features, Flow, Hero, Pricing } from "./components/sections";
import { serveImage } from "./images";

const app = new Hono<{ Bindings: Env }>();

/** LP本体（D1の内容をSSR） */
app.get("/", async (c) => {
  const content = await loadContent(c.env.DB);
  const s = content.settings;
  c.header("Cache-Control", "public, max-age=60");
  return c.html(
    "<!doctype html>" +
      (
        <Document s={s}>
          <Header s={s} />
          <main id="top">
            <Hero s={s} />
            <Features c={content} />
            <Facility c={content} />
            <Pricing c={content} />
            <Availability s={s} />
            <Flow c={content} />
            <FaqList c={content} />
            <Access s={s} />
          </main>
          <Footer s={s} />
          <FloatingCta s={s} />
        </Document>
      ).toString(),
  );
});

/** R2の写真を配信 */
app.get("/images/*", (c) => serveImage(c.env, c.req.path.slice("/images/".length), c.req.raw.headers));

app.notFound((c) => c.text("Not Found", 404));

app.onError((err, c) => {
  console.error(err);
  return c.text("Internal Server Error", 500);
});

export default app;
