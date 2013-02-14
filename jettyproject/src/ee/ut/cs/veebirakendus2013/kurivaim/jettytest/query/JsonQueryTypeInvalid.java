package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

public class JsonQueryTypeInvalid implements JsonQueryInterface {
	
	private final int errorId;
	private final String errorString;
	
	public JsonQueryTypeInvalid(int errorId, String errorString) {
		this.errorId = errorId;
		this.errorString = errorString;
	}
	
	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		return new JsonResponseTypeStatus(-errorId, "generic", errorString);
	}
	
}
