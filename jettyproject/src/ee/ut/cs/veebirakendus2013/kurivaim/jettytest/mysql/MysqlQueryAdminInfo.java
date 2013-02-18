package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MysqlQueryAdminInfo {
	private transient boolean isLoaded = false;
	
	private int userId;
	private String username;
	
	private transient final MysqlConnectionHandler sqlHandler;
	
	public MysqlQueryAdminInfo(MysqlConnectionHandler sqlHandler) {
		this.sqlHandler = sqlHandler;
	}
	
	public MysqlQueryAdminInfo querySingleById(int queryUserId) {
		PreparedStatement statement = null;
		
		try {
			statement = sqlHandler.getConnection().prepareStatement("SELECT id, username FROM ev_admins WHERE id = ?");
			statement.setInt(1, queryUserId);
			
			return fillSingleDataFromResults(statement.executeQuery());
		} catch (SQLException e) {
			//TODO: log this error somewhere
			e.printStackTrace();
		} finally {
			sqlHandler.statementCloser(statement);
		}
		
		return null;
	}
	
	public MysqlQueryAdminInfo querySingleByUserAndPass(String queryUsername, String queryPassword) {
		PreparedStatement statement = null;
		
		try {
			statement = sqlHandler.getConnection().prepareStatement("SELECT id, username FROM ev_admins WHERE username = ? AND password = ?");
			statement.setString(1, queryUsername);
			statement.setString(2, sqlHandler.getPasswordHash(queryPassword));
			
			return fillSingleDataFromResults(statement.executeQuery());
		} catch (SQLException e) {
			//TODO: log this error somewhere
			e.printStackTrace();
		} finally {
			sqlHandler.statementCloser(statement);
		}
		
		return null;
	}
	
	private MysqlQueryAdminInfo fillSingleDataFromResults(ResultSet results) throws SQLException {
		if(results.next()) {
			isLoaded = true;
			
			userId = results.getInt("id");
			username = results.getString("username");
			
			return this;
		}
		
		return null;
	}
	
	public boolean isFilled() {
		return isLoaded;
	}
	
	public int getUserId() {
		return userId;
	}
	
	public String getUsername() {
		return username;
	}
}
