import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AvatarBlock({
  url,
  alt,
  name,
  size = 72,
}: {
  url?: string;
  alt?: string;
  name: string;
  size?: number;
}) {
  const initials =
    name
      ?.split(" ")
      .map((s) => s[0]?.toUpperCase())
      .slice(0, 2)
      .join("") || "U";
  return (
    <Avatar style={{ width: size, height: size }}>
      <AvatarImage src={url} alt={alt || name} />
      <AvatarFallback className="font-semibold">{initials}</AvatarFallback>
    </Avatar>
  );
}
