import Image from "next/image";

interface authProps {
    title: String,
    description: String
};

function Auth({ title, description}: authProps ) {
  return (
    <div className="auth-page">
      <div className="auth-image">
        <Image
          src="/assets/images/10323866.png"
          width={500}
          height={600}
          alt="Falcon"
          className="responsive-img"
        />
      </div>
      <div className="auth-content">
        <h3>{title}</h3>
        <p>{description}</p>
        
      </div>
    </div>
  );
}

export default Auth;
