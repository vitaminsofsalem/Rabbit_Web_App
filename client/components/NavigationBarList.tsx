import classes from "../styles/NavigationBar.module.scss";

export interface ListItem {
  iconName: string;
  label: string;
}

export interface Props {
  items: ListItem[];
  activeLabel: string;
  onItemClick: (label: string) => void;
}

export const NavigationBarList = (props: Props) => {
  return (
    <div className={classes.listContainer}>
      {props.items.map((item) => (
        <div
          key={item.label}
          onClick={() => {
            props.onItemClick(item.label);
          }}
          className={
            (item.label == props.activeLabel ? classes.activeEntry : "") +
            " " +
            classes.entryContainer
          }
        >
          <div
            className={
              classes.navigationBarIcon +
              " " +
              classes[
                item.iconName +
                  (item.label == props.activeLabel ? "Opaque" : "")
              ]
            }
          ></div>
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  );
};
