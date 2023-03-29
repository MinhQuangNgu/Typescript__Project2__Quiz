import React from "react";
import "./style.scss";
interface props {
	create: boolean;
	setCreate: React.Dispatch<React.SetStateAction<boolean>>;
}
const Create: React.FC<props> = ({ create, setCreate }) => {
	return (
		<div className="create">
			<div className="create__container">
				<div className="create__title">
					<i>Tạo mới</i>
				</div>
				<div className="create__quiz"></div>
				<div className="create__question"></div>
				<div className="cancel">
					<div
						onClick={() => {
							setCreate(false);
						}}
					>
						&times;
					</div>
				</div>
			</div>
		</div>
	);
};

export default Create;
