CREATE TABLE Users (
	id				INT AUTO_INCREMENT,
	user_id			VARCHAR(12) NOT NULL,
	-- salt			CHAR(8)
	hashed_password VARCHAR(64) NOT NULL,
	nickname		VARCHAR(8),
	created_at		DATETIME NOT NULL,
	updated_at		DATETIME NOT NULL,
	PRIMARY KEY (id)
)


CREATE TABLE Notes (
	note_id			INT AUTO_INCREMENT,
	author			INT NOT NULL,
	content			TEXT,
	crated_at		DATETIME NOT NULL,
	updated_at		DATETIME NOT NULL,
	-- deleted_at		DATETIME,
	PRIMARY KEY (note_id),
	FOREIGN KEY author REFERENCES Users(id)
)

CREATE TABLE Lastnote (
	note_id			INT,
	author			INT,
	PRIMARY KEY (author, note_id),
	FOREIGN KEY note_id REFERENCES Notes(note_id),
	FOREIGN KEY author REFERENCES Users(id)
)