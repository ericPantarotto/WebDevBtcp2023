import { Actor, HttpAgent } from "@dfinity/agent";
import React, { useEffect, useState } from "react";
import { idlFactory } from "../../../declarations/nft";
import { opend } from "../../../declarations/opend";
import { idlFactory as tokenIdlFactory } from "../../../declarations/token";
import CURRENT_USER_ID from "../index";
import Button from "./Button";
import PriceLabel from "./PriceLabel";
import { Principal } from "../../../../node_modules/@dfinity/principal/lib/cjs/index";

function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setpriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [shouldDisplay, setShouldDisplay] = useState(true);

  const id = props.id;
  // const id = Principal.fromText(props.id);

  const localHost = "http://localhost:8080/";
  const agent = new HttpAgent({ host: localHost });
  agent.fetchRootKey();
  let NFTActor;

  async function loadNFT() {
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });
    
    const name = await NFTActor.getName();

    const principal = await NFTActor.getOwner();
    
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer], { type: "image/png" })
    );

    setName(name);
    setOwner(principal.toText());
    setImage(image);
    
    if (props.role =="collection") {    
      const nftIsListed = await opend.isListed(props.id);
      if (nftIsListed) {
        setOwner("OpenD");
        setBlur({ filter: "blur(4px)" })
        setSellStatus("Listed");
      } else {
        setButton(<Button handleClick={handleSell} text="Sell" />)
      }
    } else if (props.role == "discover") {
      const originalOwner = await opend.getOriginalOwner(props.id);
      if (originalOwner.toText() != CURRENT_USER_ID.toText()) {
        setButton(<Button handleClick={handleBuy} text="Buy" />)
      }

      const price = await opend.getListedNFTPrice(props.id);
      setPriceLabel(<PriceLabel sellPrice={price.toString()} />);
    }
  };
  
  let price;
  function handleSell() {
    setpriceInput(
      <input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={e=> price=e.target.value}
      />
    );
    setButton(<Button handleClick={sellItem} text="Confirm"/>)
  };

  async function handleBuy() {
    console.log("Buy triggered");
    setLoaderHidden(false);

    const tokenActor = await Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai"),
    });

    const sellerId = await opend.getOriginalOwner(props.id);
    const price = await opend.getListedNFTPrice(props.id);

    const result = await tokenActor.transfer(sellerId, price);
    console.log("Cash result: " + result);
    //Transfer ownership
    if (result == "Success.") {
      const transferResult = await opend.completePurchase(props.id, sellerId, CURRENT_USER_ID);
      console.log("transfer result: " + transferResult);
      setLoaderHidden(true);
      setShouldDisplay(false);
    }
  }

  async function sellItem() {
    setBlur({ filter: "blur(4px)" });

    setLoaderHidden(false);

    const listingResult = await opend.listItem(props.id, Number(price));
    console.log("listing: " + listingResult);

    if (listingResult == "Success") {
      const opendId = await opend.getOpenDCanisterID();
      const transferResult = await NFTActor.transferOwnership(opendId);
      console.log("transfer:" + transferResult);
      if (transferResult == "Success") {
        setLoaderHidden(true);
        setButton();
        setpriceInput();
        setOwner("OpenD");
        setSellStatus("Listed");
      }
    }
  };


  useEffect(() => {
    loadNFT();
  }, []);

  return (
    <div style={{ display: shouldDisplay ? "inline": "none" }} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div className="lds-ellipsis" hidden={loaderHidden}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {props.showButton && button}
        </div>
      </div>
    </div>
  );
}

export default Item;
