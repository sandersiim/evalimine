package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MysqlQueryUserInfo {
	private boolean isLoaded = false;
	private int userId;
	private String username;
	private int voteRegionId;
	private int votedCandidateId;
	
	private final MysqlConnectionHandler sqlHandler;
	
	public MysqlQueryUserInfo(MysqlConnectionHandler sqlHandler) {
		this.sqlHandler = sqlHandler;
	}
	
	public MysqlQueryUserInfo querySingleById(int queryUserId) {
		PreparedStatement statement = null;
		
		try {
			statement = sqlHandler.getConnection().prepareStatement("SELECT id, username, voteRegionId, votedCandidateId FROM ev_users WHERE id = ?");
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
	
	public MysqlQueryUserInfo querySingleByUsername(String queryUsername) {
		PreparedStatement statement = null;
		
		try {
			statement = sqlHandler.getConnection().prepareStatement("SELECT id, username, voteRegionId, votedCandidateId FROM ev_users WHERE username = ?");
			statement.setString(1, queryUsername);
			
			return fillSingleDataFromResults(statement.executeQuery());
		} catch (SQLException e) {
			//TODO: log this error somewhere
			e.printStackTrace();
		} finally {
			sqlHandler.statementCloser(statement);
		}
		
		return null;
	}
	
	public MysqlQueryUserInfo querySingleByUserAndPass(String queryUsername, String queryPassword) {
		PreparedStatement statement = null;
		
		try {
			statement = sqlHandler.getConnection().prepareStatement("SELECT id, username, voteRegionId, votedCandidateId FROM ev_users WHERE username = ? AND password = ?");
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
	
	private MysqlQueryUserInfo fillSingleDataFromResults(ResultSet results) throws SQLException {
		if(results.next()) {
			isLoaded = true;
			
			userId = results.getInt("id");
			username = results.getString("username");
			voteRegionId = results.getInt("voteRegionId");
			votedCandidateId = results.getInt("votedCandidateId");
			
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
	
	public int getVoteRegionId() {
		return voteRegionId;
	}
	
	public int getVotedCandidateId() {
		return votedCandidateId;
	}
}
