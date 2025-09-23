// app/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 py-3 md:flex-row">
        {/* Copyright */}
        <span className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Word Mate. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
