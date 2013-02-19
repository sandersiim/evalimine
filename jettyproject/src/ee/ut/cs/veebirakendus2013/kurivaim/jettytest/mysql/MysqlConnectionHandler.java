package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class MysqlConnectionHandler {
	private Connection sqlConnection = null;
	private final String passwordSalt = "evalimised_";
	
	public boolean validateConnection() {
		try {
			if(sqlConnection != null && !sqlConnection.isValid(0)) {
				sqlConnection = null;
			}
		} catch (SQLException e) {
			sqlConnection = null;
		}
		
		if(sqlConnection == null) {
			try {
				return connect();
			} catch (Exception e) {
				e.printStackTrace(); //TODO: when logging system is present, log this error
				return false;
			}
		}
		else {
			return true;
		}
	}
	
	public Connection getConnection() {
		return sqlConnection;
	}
	
	public boolean connect() {
		try {
			sqlConnection = DriverManager.getConnection("jdbc:mysql://localhost:3306/evalimised", "evalimised_user", "PaSsWoRd123");
		} catch (SQLException e) {
			e.printStackTrace(); //TODO: when logging system is present, log this error
			return false;
		}
		
		return true;
	}
	
	public int simpleUpdateQuery(String queryString) {
		return simpleQuery(queryString, false);
	}
	
	public int simpleQuery(String queryString, boolean returnKey) {
		Statement statement = null;
		
		try {
			statement = sqlConnection.createStatement();
			int affectedRows = returnKey ? statement.executeUpdate(queryString, Statement.RETURN_GENERATED_KEYS) : statement.executeUpdate(queryString);
	    	
	        return affectedRows;
		} catch(Exception e) {
			e.printStackTrace(); //TODO: when logging system is present, log this error
			return -1;
		} finally {
			statementCloser(statement);
		}
	}
	
	public void statementCloser(Statement statement) {
		try {
			if(statement != null) {
				statement.close();
			}
		} catch (SQLException e) {
			e.printStackTrace(); //TODO: log this error?
		}
	}
	
	public void disconnect() {
		if(sqlConnection != null) {
			try {
				sqlConnection.close();
				sqlConnection = null;
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	
	public String getGenericHash(String inputString) {
		MessageDigest md = null;
		
		try {
			md = MessageDigest.getInstance("SHA-1");
		}
		catch(NoSuchAlgorithmException e) {
			e.printStackTrace();
			
			return null;
		}
		
		byte[] hashBytes = md.digest(inputString.getBytes());
		
		StringBuilder hashString = new StringBuilder();
		final String hexString = "0123456789ABCDEF";
		
		for(int i = 0; i < hashBytes.length; i++) {
			hashString.append(hexString.charAt((hashBytes[i] >> 4) & 0xF));
			hashString.append(hexString.charAt((hashBytes[i] >> 0) & 0xF));
		}
		
		return hashString.toString();
	}
	
	public String getPasswordHash(String passwordString) {
		return getGenericHash(passwordSalt + passwordString);
	}
}
