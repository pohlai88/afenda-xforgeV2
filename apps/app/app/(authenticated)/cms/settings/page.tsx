import { getSettings } from "@/app/actions/cms/settings";
import { SettingsEditor } from "../_components/settings-editor";

const CmsSettingsPage = async () => {
  const result = await getSettings();

  if (!result.ok) {
    return (
      <p className="text-destructive text-sm" role="alert">
        {result.error}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-semibold text-xl tracking-tight">Site settings</h2>
        <p className="text-muted-foreground text-sm">
          Global marketing site name and tagline from{" "}
          <code className="text-xs">content/settings.json</code>.
        </p>
      </div>
      <SettingsEditor initialSettings={result.data} />
    </div>
  );
};

export default CmsSettingsPage;
