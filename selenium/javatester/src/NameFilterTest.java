import java.util.List;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;

public class NameFilterTest {
	private WebDriver driver;
	private String baseUrl;
	private StringBuffer verificationErrors = new StringBuffer();

	@Before
	public void setUp() throws Exception {
		driver = new FirefoxDriver();
		baseUrl = "http://maxorator.com:8080";
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	}

	@Test
	public void testNameFilter() throws Exception {
		driver.get(baseUrl + "/");
		driver.findElement(By.id("menu_statistics")).click();
		
		Thread.sleep(300);

		driver.findElement(By.cssSelector(".tabNameLabelsMultiple a:nth-of-type(2)")).click();
		
		Thread.sleep(300);
		
		driver.findElement(By.id("candidateViewNameFilter")).clear();
		driver.findElement(By.id("candidateViewNameFilter")).sendKeys("ca");
		
		Thread.sleep(300);
		
		//equivalent for the eval used in IDE
		
		List<WebElement> elements = driver.findElements(By.cssSelector("#statsCandidateList .candidateForStats"));
		
		for(WebElement element : elements) {
			assert(element.findElement(By.cssSelector(".candidateName span")).getText().split(" ")[1].substring(0, 2).toLowerCase().equals("ca"));
		}
	}

	@After
	public void tearDown() throws Exception {
		driver.quit();
		String verificationErrorString = verificationErrors.toString();
		if (!"".equals(verificationErrorString)) {
			fail(verificationErrorString);
		}
	}
}
