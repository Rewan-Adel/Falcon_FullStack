"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="main">
      <div className="hero">
        <h1 className="blue-gradient">A Falcon is the perfect hunter</h1>
        <p className="description">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis sunt quasi tenetur adipisci, non ipsum recusandae! Quo in eum voluptas nemo autem vitae blanditiis praesentium maxime neque. Perferendis, perspiciatis animi.
        </p>
        <div className="input-group">
        <Link href='/auction'> <button className="white-btn">Explore Auctions</button></Link>
        <Link href='marketplace'> <button className="white-btn">View Marketplace</button></Link>
        </div>
      </div>
      
      <div className= "about">
        <div className="dsc">
          <h2 >About Us</h2>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis sunt quasi tenetur adipisci, non ipsum recusandae! Quo in eum voluptas nemo autem vitae blanditiis praesentium maxime neque. Perferendis, perspiciatis animi.
          <br></br>
          <Link href='/auction'> <button className="blue-btn">Explore Auctions</button></Link>
          </p>
          </div> 

          <div className="about-img">
          <Image src="/assets/images/pexels-photo-29168314.webp" width={128} height={77} alt="falcon" />
          </div>
      </div>
    </div>

  );
}
