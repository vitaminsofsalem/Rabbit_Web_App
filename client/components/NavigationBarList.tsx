import { useState } from "react";
import classes from "../styles/NavigationBar.module.scss";

export interface ListItem {
  iconName: String;
  label: String;
  onClick: any;
}

export interface Props {
  items: ListItem[];
}

export const NavigationBarList = (props: Props) => {
  const [activeLabel, setActiveLabel] = useState<String>("Home");
  return (
    <div className={classes.listContainer}>
      {props.items.map((item) => (
        <div
          onClick={() => {
            setActiveLabel(item.label);
            item.onClick();
          }}
          className={
            (item.label == activeLabel ? classes.activeEntry : "") +
            " " +
            classes.entryContainer
          }
        >
          <div
            className={
              classes.navigationBarIcon +
              " " +
              classes[
                item.iconName + (item.label == activeLabel ? "Opaque" : "")
              ]
            }
          ></div>
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  );

  // return (
  //   <div className={classes.listContainer}>
  //     <div className={`${classes.activeEntry} ${classes.entryContainer}`}>
  //       <div
  //         className={`${classes.navigationBarIcon} ${classes.houseOpaque}`}
  //       ></div>
  //       <text>placeholder</text>
  //     </div>
  //     <div className={`${classes.activeEntry} ${classes.entryContainer}`}>
  //       <text>placeholder</text>
  //     </div>
  //     <div className={` ${classes.entryContainer}`}>
  //       <text>placeholder</text>
  //     </div>
  //   </div>
  // );
};
