function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-secondary-600">
          <div>© 2025 SkillBridge. All rights reserved.</div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-primary-600">
              Privacy
            </a>
            <a href="#" className="hover:text-primary-600">
              Terms
            </a>
            <a href="/" className="hover:text-primary-600">
              Home
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
