package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import java.io.File;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryCandidateInfo;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryUserInfo;

public class JsonQueryTypeApplication implements JsonQueryInterface {
	
	private String firstName;
	private String lastName;
	private int partyId;

	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		try {
			if(firstName == null || firstName.length() < 2 || firstName.length() > 60) {
				return new JsonResponseTypeStatus(100, "applyAction", "Candidacy application failed - first name undefined or not with length 2-60.");
			}
			else if(lastName == null || lastName.length() < 2 || lastName.length() > 60) {
				return new JsonResponseTypeStatus(101, "applyAction", "Candidacy application failed - last name undefined or not with length 2-60.");
			}
			
			MysqlConnectionHandler sqlHandler = queryInfo.getSqlHandler();
			
			if(!sqlHandler.validateConnection()) {
				return new JsonResponseTypeStatus(-1, "applyAction", "Candidacy application failed - no database connection.");
			}
			
			MysqlQueryUserInfo userInfo = queryInfo.getLoggedInUserInfo();
			
			if(userInfo == null) {
				return new JsonResponseTypeStatus(1, "applyAction", "Candidacy application failed - not logged in.");
			}
			else if(userInfo.getVoteRegionId() == 0) {
				return new JsonResponseTypeStatus(2, "applyAction", "Candidacy application failed - region not defined.");
			}
			else {
				MysqlQueryCandidateInfo candidateInfo = new MysqlQueryCandidateInfo(sqlHandler).querySingleByUserId(userInfo.getUserId());
				
				if(candidateInfo != null) {
					return new JsonResponseTypeStatus(3, "applyAction", "Candidacy application failed - already a candidate.");
				}
				else {
					int affected = -1;
					
					File userPhotoPath = new File("../html/userimg/user_" + userInfo.getUserId() + ".jpg");
					
					try {
						PreparedStatement statement = sqlHandler.getConnection().prepareStatement(
								"INSERT INTO ev_candidates (userId, regionId, partyId, firstName, lastName, hasPhoto) SELECT ?, ?, ?, ?, ?, ? FROM ev_parties WHERE id = ?");
						
						statement.setInt(1, userInfo.getUserId());
						statement.setInt(2, userInfo.getVoteRegionId());
						statement.setInt(3, partyId);
						statement.setString(4, firstName);
						statement.setString(5, lastName);
						statement.setInt(6, userPhotoPath.exists() ? 1 : 0);
						statement.setInt(7, partyId);
						affected = statement.executeUpdate();
					}
					catch(SQLException e) {
						e.printStackTrace(); //TODO: log this error
					}
					
					if(affected == -1) {
						return new JsonResponseTypeStatus(-1, "applyAction", "Candidacy application failed - database query error.");
					}
					else if(affected == 0) {
						return new JsonResponseTypeStatus(4, "applyAction", "Candidacy application failed - no such party.");
					}
					else {
						String cardFirstName = queryInfo.getSessionStringParameter("firstName"), cardLastName = queryInfo.getSessionStringParameter("lastName");
						
						MysqlQueryCandidateInfo newCandidateInfo = queryInfo.getLoggedInCandidateInfo();
						
						File candidatePhotoPath = new File("../html/userimg/candidate_" + newCandidateInfo.getCandidateId() + ".jpg");
						
						if(userPhotoPath.exists()) {
							if(candidatePhotoPath.exists()) {
								candidatePhotoPath.delete();
							}
							
							userPhotoPath.renameTo(candidatePhotoPath);
						}
						
						queryInfo.doLiveBroadcast(new JsonResponseTypeCandidate(newCandidateInfo));
						
						return new JsonResponseTypeUserInfo("applyAction", userInfo, newCandidateInfo, cardFirstName, cardLastName);
					}
				}
			}
		}
		catch(Exception e) {
			e.printStackTrace(); //TODO: when logging system is present, log this error
			
			return new JsonResponseTypeStatus(-1, "applyAction", "Candidacy application - unknown error.");
		}
	}
}
