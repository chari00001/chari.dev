const Footer = () => {
  return (
    <footer className="bg-tertiary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-textSecondary">
          <p>© {new Date().getFullYear()} Berk Çağrı Laçin. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 