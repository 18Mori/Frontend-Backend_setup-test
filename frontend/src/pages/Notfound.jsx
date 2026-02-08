function Notfound() {
    return (
    <>
        <div className="relative">
            <h1 className="text-9xl font-bold text-primary opacity-20"
            aria-hidden="true">
              404
            </h1>
          </div>
        
        <h2 className="flex justify-center mb-6 text-2xl font-medium text-onBackground ">Page Not Found</h2>
        <p className="flex justify-center mb-6 text-onBackground/70">
          The page you're looking for doesn't exist. Let's get you back!
        </p>
    </>
    )
}

export default Notfound