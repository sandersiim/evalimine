package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class MysqlQueryCandidateInfo {
	private transient boolean isLoaded = false;
	
	private int candidateId;
	private int userId;
	private int regionId;
	private int partyId;
	private int voteCount;
	private String firstName;
	private String lastName;
	private boolean hasPhoto;
	
	private transient final MysqlConnectionHandler sqlHandler;
	
	public MysqlQueryCandidateInfo(MysqlConnectionHandler sqlHandler) {
		this.sqlHandler = sqlHandler;
	}
	
	public MysqlQueryCandidateInfo querySingleByUserId(int queryUserId) {
		PreparedStatement statement = null;
		
		try {
			statement = sqlHandler.getConnection().prepareStatement("SELECT * FROM ev_candidates WHERE userId = ?");
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
	
	public MysqlQueryCandidateInfo querySingleByCandidateId(int queryCandidateId) {
		PreparedStatement statement = null;
		
		try {
			statement = sqlHandler.getConnection().prepareStatement("SELECT * FROM ev_candidates WHERE id = ?");
			statement.setInt(1, queryCandidateId);
			
			return fillSingleDataFromResults(statement.executeQuery());
		} catch (SQLException e) {
			//TODO: log this error somewhere
			e.printStackTrace();
		} finally {
			sqlHandler.statementCloser(statement);
		}
		
		return null;
	}
	
	public List<MysqlQueryCandidateInfo> queryAllByFilter(int queryRegionId, int queryPartyId, String namePrefix, int orderingMethod, int startIndex, int count) {
		PreparedStatement statement = null;
		
		try {
			if(count <= 0) count = 50;
			
			String limitString = (startIndex > 0) ? " LIMIT " + startIndex + ", " + count : " LIMIT " + count;
			
			String orderingString = "";
			
			if(orderingMethod == 1) orderingString = " ORDER BY id ASC";
			else if(orderingMethod == 2) orderingString = " ORDER BY id DESC";
			else if(orderingMethod == 3) orderingString = " ORDER BY voteCount ASC";
			else if(orderingMethod == 4) orderingString = " ORDER BY voteCount DESC";
			else if(orderingMethod == 5) orderingString = " ORDER BY realName ASC";
			else if(orderingMethod == 6) orderingString = " ORDER BY realName DESC";
			
			String regionFilter = (queryRegionId > 0) ? " AND regionId = " + queryRegionId : "";
			String partyFilter = (queryPartyId > 0) ? " AND partyId = " + queryPartyId : "";
			
			String nameFilter = "", nameField = "";
			
			if(namePrefix != null && namePrefix.length() > 0) {
				nameFilter = " HAVING realName LIKE ?";
				nameField = ", CONCAT(lastName, ', ', firstName) AS realName";
			}
			
			statement = sqlHandler.getConnection().prepareStatement("SELECT *" + nameField + " FROM ev_candidates WHERE 1" + regionFilter + partyFilter + nameFilter + orderingString + limitString);
			if(namePrefix != null && namePrefix.length() > 0) statement.setString(1, namePrefix + "%");
			
			return fillMultiDataFromResults(statement.executeQuery());
		} catch (SQLException e) {
			//TODO: log this error somewhere
			e.printStackTrace();
		} finally {
			sqlHandler.statementCloser(statement);
		}
		
		return null;
	}
	
	private MysqlQueryCandidateInfo fillSingleDataFromResults(ResultSet results) throws SQLException {
		if(results.next()) {
			return fillDataFromNextResult(results);
		}
		
		return null;
	}
	
	private List<MysqlQueryCandidateInfo> fillMultiDataFromResults(ResultSet results) throws SQLException {
		ArrayList<MysqlQueryCandidateInfo> lines = new ArrayList<MysqlQueryCandidateInfo>();
		
		while(results.next()) {
			lines.add(new MysqlQueryCandidateInfo(null).fillDataFromNextResult(results));
		}
		
		return lines;
	}
	
	private MysqlQueryCandidateInfo fillDataFromNextResult(ResultSet results) throws SQLException {
		isLoaded = true;
		
		candidateId = results.getInt("id");
		userId = results.getInt("userId");
		regionId = results.getInt("regionId");
		partyId = results.getInt("partyId");
		voteCount = results.getInt("voteCount");
		firstName = results.getString("firstName");
		lastName = results.getString("lastName");
		hasPhoto = results.getBoolean("hasPhoto");
		
		return this;
	}
	
	public boolean isFilled() {
		return isLoaded;
	}
	
	public int getCandidateId() {
		return candidateId;
	}
	
	public int getUserId() {
		return userId;
	}
	
	public int getRegionId() {
		return regionId;
	}
	
	public int getPartyId() {
		return partyId;
	}
	
	public int getVoteCount() {
		return voteCount;
	}
	
	public String getFirstName() {
		return firstName;
	}
	
	public String getLastName() {
		return lastName;
	}
	
	public boolean getHasPhoto() {
		return hasPhoto;
	}
}
